/*
CreatePortrait:Lenette, LeftSlot1
            MM.CreateCharacter("Lenette", MomentManager.PortraitPosition.LeftSlot1);

FadePortraitIn: Lenette
            MM.FadePortaitIn(" Lenette");

SetFaceExpression:Lenette, Angry
            MM.SetCharacterFacialExpression("Lenette", CharacterFacialExpressions.Angry);

ChangeBackground:SandyCoast
            MM.FadeBackgroundIn(MomentManager.BackgroundNames.SandyCoast);

*/

import { reSpeaker } from "./common";

interface StoryNarrationPart {
  type: 'narration'
  text: string;
}

interface StoryDialoguePart {
  type: 'dialogue'
  name: string;
  text: string;
}

interface StoryCommandPart {
  type: 'command'
}

export type StoryPart = StoryNarrationPart | StoryDialoguePart;

export function parseRawText(rawText: string): StoryPart[] {
  const storyParts: StoryPart[] = [];

  const lines = rawText.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (!line)
      continue;

      reSpeaker.lastIndex = 0;

    let match: RegExpExecArray | null = null;
    if (match = reSpeaker.exec(line)) {
      storyParts.push({
        type: 'dialogue',
        name: match[1],
        text: match[2],
      });
    } else {
      storyParts.push({
        type: 'narration',
        text: line
      });
    }
  }

  return storyParts;
}