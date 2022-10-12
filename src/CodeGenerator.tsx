import React from 'react';
import { codegenFunc, codegenYield } from './codegen';
import { Speaker } from './common';
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
