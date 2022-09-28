import React from 'react';
import { reSpeaker, Speaker } from './common';
import { parseRawText, StoryPart } from './parser';

interface Props {
  momentName: string;
  speakers: Speaker[];
  rawText: string;
}

interface State {
  output: "yield" | "func"
}

export class CodeGenerator extends React.Component<Props, State> {
  state: State = {
    output: "func",
  };

  codegen(): string {
    const parsed = parseRawText(this.props.rawText);
    updateNames(parsed, this.props.speakers);

    if (this.state.output === "yield")
      return codegenYield();
    else if (this.state.output === "func")
      return codegenFunc(this.props.momentName, parsed);
    else
      return `codegen style "${this.state.output}" not implemented`;
  }

  render(): React.ReactNode {
    return <div className="CodeGenerator">
      <textarea readOnly value={this.codegen()} />
    </div>;
  }
}


function updateNames(story: StoryPart[], speakers: Speaker[]) {
  const speakerMap: Map<string, string> = new Map();
  for (const speaker of speakers) {
    speakerMap.set(speaker.shortName, speaker.longName);
  }

  for (const part of story) {
    if (part.type === "dialogue" && speakerMap.has(part.name))
    {
      part.name = speakerMap.get(part.name) || `${part.name} EMPTY!`
    }
  }
}

function codegenYield(): string {
  throw new Error("not implemented");
}

function codegenFunc(momentName: string, story: StoryPart[]): string {
  const functions: string[] = [];
  const functionAdds: string[] = [];

  for (const part of story) {
    let funcBody: string = "";
    if (part.type === "dialogue") {
      funcBody = `\
            MM.SetForCharacter("${part.name}");
            MM.SetNarrationText("${part.text}");\
`;
    }
    else if (part.type === "narration") {
      funcBody = `\
            MM.SetNarrationText("${part.text}");\
`;
    }


    const functionName = `func${functions.length + 1}`;
    functionAdds.push(`            funcs.Add(${functionName});`);
    functions.push(`\
        void ${functionName}()
        {
${funcBody}
        }\
`);
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