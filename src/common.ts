export interface Speaker {
  shortName: string;
  longName: string;
}

export const reCommand = /^([a-zA-Z0-9]{6,}):\s*([^\n]+)/gm;
export const reSpeaker = /^([a-zA-Z0-9]{1,5}):\s*([^\n]+)/gm;

