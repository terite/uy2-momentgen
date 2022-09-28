import React from 'react';
import './App.css';
import { CodeGenerator } from './CodeGenerator';
import { Namer } from './Namer';
import { StoryInput } from './StoryInput';
import { reSpeaker, Speaker } from './common';

interface Props {
}

interface State {
  shownPanel: 1 | 2 | 3;
  rawText: string;
  speakers: Speaker[];
  momentName: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shownPanel: 1,
      rawText: "",
      speakers: [],
      momentName: "UPDATEME"
    };
  }

  handleRawTextChange = (newRawText: string) => {
    this.setState({
      rawText: newRawText,
      speakers: this.parseSpeakers(newRawText),
    });
  };

  parseSpeakers(rawText: string): Speaker[] {
    const newSpeakers: Speaker[] = [];

    let match: RegExpExecArray | null = null;
    while (match = reSpeaker.exec(rawText)) {
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

  renderScreen(): React.ReactNode {
    if (this.state.shownPanel === 1)
      return <StoryInput
        rawText={this.state.rawText}
        onRawTextChange={this.handleRawTextChange} />;
    else if (this.state.shownPanel === 2)
      return <Namer
        momentName={this.state.momentName}
        onMomentNameChange={this.handleMomentNameChange}
        speakers={this.state.speakers}
        onSpeakerChange={this.handleSpeakerChange} />;
    else
      return <CodeGenerator
        momentName={this.state.momentName}
        rawText={this.state.rawText}
        speakers={this.state.speakers} />;
  }

  renderNavBar(): React.ReactNode {
    return <div className="navbar">
      <button onClick={() => this.setState({ shownPanel: 1 })} disabled={this.state.shownPanel === 1}>1</button>
      <button onClick={() => this.setState({ shownPanel: 2 })} disabled={this.state.shownPanel === 2}>2</button>
      <button onClick={() => this.setState({ shownPanel: 3 })} disabled={this.state.shownPanel === 3}>3</button>
    </div>
  }

  render(): React.ReactNode {
    return (
      <div className="App">
        {this.renderNavBar()}
        <hr />
        {this.renderScreen()}
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
