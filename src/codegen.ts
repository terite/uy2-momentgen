import { StoryPart } from './parser';

export function codegenYield(): string {
  throw new Error("not implemented");
}

export function codegenFunc(momentName: string, storyParts: StoryPart[]): string {
  const functions: string[] = [];
  const functionAdds: string[] = [];

  let funcBody: string = "";

  for (const part of storyParts) {
    if (part.type === "command") {
      funcBody += part.code;
      continue;
    }

    if (part.type === "dialogue") {
      funcBody += `MM.SetForCharacter("${part.name}");\n`;
      funcBody += `MM.SetNarrationText("${part.text}");\n`;
    }
    else if (part.type === "narration") {
      funcBody += `MM.SetNarrationText("${part.text}");\n`;
    }

    const functionName = `func${functions.length + 1}`;
    functionAdds.push(indent(`funcs.Add(${functionName});`, 12));
    functions.push(`\
        void ${functionName}()
        {
${indent(funcBody, 12)}
        }\
`);
    funcBody = "";
  }

    return `\
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


namespace Moment
{
    public class ${momentName} : Moment
    {

${functions.join("\n\n")}

        public override void Setup()
        {
${functionAdds.join("\n")}
            funcs.Add(End);
        }

    }
}
`;
}

function indent(lines: string, spaces: number): string {
  const prefix = "".padStart(spaces);
  return lines.split("\n").map(line => `${prefix}${line}`).join("\n");
}