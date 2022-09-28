import React from "react";
import { Speaker } from "./common";

interface Props {
  momentName: string;
  onMomentNameChange: (newName: string) => void;

  speakers: Speaker[];
  onSpeakerChange: (newSpeaker: Speaker) => void;
}

interface State {
}

export class Namer extends React.Component<Props, State> {
  handleMomentNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.props.onMomentNameChange(event.target.value);
  };

  handleSpeakerChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.props.onSpeakerChange({
      shortName: event.target.dataset["shortname"] ?? "",
      longName: event.target.value,
    });
  };

  renderSpeaker = (speaker: Speaker): React.ReactNode => {
    return <tr key={speaker.shortName}>
      <td>
        <b>{speaker.shortName}</b>
      </td>
      <td>
        <input data-shortname={speaker.shortName} value={speaker.longName} onChange={this.handleSpeakerChange} />
      </td>
    </tr>;
  };

  render(): React.ReactNode {
    const speakers = this.props.speakers.map(this.renderSpeaker);
    return <div className="Namer">
      <label>
        Class Name
        <input value={this.props.momentName} onChange={this.handleMomentNameChange} />
      </label>
      <table>
        <thead>
          <tr>
            <th>Short Name</th>
            <th>Long Name</th>
          </tr>
        </thead>
        <tbody>
            {speakers}
        </tbody>
      </table>
    </div>
  }
}