import React from 'react';
import { CodeGenerator } from './CodeGenerator';
import { Namer } from './Namer';
import { StoryInput } from './StoryInput';
import { reSpeaker, Speaker } from './common';

interface Props {
}

interface State {
  shownPanel: 'edit' | 'generate';
  rawText: string;
  speakers: Speaker[];
  momentName: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shownPanel: 'edit',
      rawText: "",
      speakers: [],
      momentName: "UPDATEME"
    };
  }

  handleRawTextChange = (newRawText: string) => {
    this.setState((oldState) => {
      const oldSpeakersMap = new Map<string, Speaker>();
      for (const speaker of oldState.speakers) {
        oldSpeakersMap.set(speaker.shortName, speaker);
      }

      const newSpeakers = this.parseSpeakers(newRawText).map(newSpeaker => {
        if (oldSpeakersMap.has(newSpeaker.shortName)) {
          return oldSpeakersMap.get(newSpeaker.shortName)!;
        } else {
          return newSpeaker;
        }

      });
      return {
        ...oldState,
        rawText: newRawText,
        speakers: newSpeakers,
      }
    });
  };

  parseSpeakers(rawText: string): Speaker[] {
    const newSpeakers: Speaker[] = [];

    while (true) {
      let match = reSpeaker.exec(rawText)
      if (!match)
        break;

      let found = false;
      for (const speaker of newSpeakers) {
        if (speaker.shortName === match[1]) {
          found = true;
          break;
        }
      }

      if (found)
        continue;

      newSpeakers.push({
        shortName: match[1],
        longName: "",
      });
    }
    return newSpeakers;
  }

  handleMomentNameChange = (newName: string) => {
    this.setState({
      momentName: newName
    });
  }

  handleSpeakerChange = (newSpeaker: Speaker) => {
    this.setState((oldState: State): State => {
      const newSpeakers = oldState.speakers.map(oldSpeaker => {
        if (oldSpeaker.shortName === newSpeaker.shortName)
          return newSpeaker;
        else
          return oldSpeaker;
      });

      return {
        ...oldState,
        speakers: newSpeakers,
      }
    });
  };

  renderBody(): React.ReactNode {
    if (this.state.shownPanel === 'edit') {
      return <div className="body">
        <div className="left">
          <StoryInput
            rawText={this.state.rawText}
            onRawTextChange={this.handleRawTextChange} />
        </div>
        <div className="right">
          <Namer
            momentName={this.state.momentName}
            onMomentNameChange={this.handleMomentNameChange}
            speakers={this.state.speakers}
            onSpeakerChange={this.handleSpeakerChange} />
        </div>
      </div>
    }
    else {
      return <CodeGenerator
        momentName={this.state.momentName}
        rawText={this.state.rawText}
        speakers={this.state.speakers} />
    }
  }

  renderNavBar(): React.ReactNode {
    if (this.state.shownPanel === 'edit') {
      return <div className="navbar">
        <button onClick={() => this.setState({ shownPanel: 'generate' })}>Generate</button>
      </div>
    } else {
      return <div className="navbar">
        <button onClick={() => this.setState({ shownPanel: 'edit' })}>edit</button>
      </div>
    }
  }

  render(): React.ReactNode {
    return (
      <div className="App">
        {this.renderNavBar()}
        <hr />
        {this.renderBody()}
      </div>
    );
  }

  renderDebugInfo(): React.ReactNode {
    return <>
      <div>content: <b>{this.state.rawText}</b></div>
      <div>speakers: <b>{this.state.speakers.length} {this.state.speakers.map(s => JSON.stringify(s)).join(", ")}</b></div>
    </>;
  }
}
export default App;
