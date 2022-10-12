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

import { reCommand, reSpeaker } from "./common";

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
  type: 'command',
  command: string,
  arguments: string[],
  code: string,
}

export type StoryPart = StoryNarrationPart | StoryDialoguePart | StoryCommandPart;

export function parseRawText(rawText: string): StoryPart[] {
  const storyParts: StoryPart[] = [];

  const lines = rawText.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (!line)
      continue;

    const command = parseCommand(line);
    if (command) {
      storyParts.push(command);
      continue;
    }

    reSpeaker.lastIndex = 0;
    const dialogueMatch = reSpeaker.exec(line);
    if (dialogueMatch) {
      storyParts.push({
        type: 'dialogue',
        name: dialogueMatch[1],
        text: dialogueMatch[2],
      });
      continue;
    }

    storyParts.push({
      type: 'narration',
      text: line
    });
  }

  return storyParts;
}

function parseCommand(line: string): StoryCommandPart | null {
  reCommand.lastIndex = 0;
  const match = reCommand.exec(line);

  if (!match)
    return null;

  const [, commandName, argString] = match;
  const args = argString.split(",").map(s => s.trim());

  function getArg(index: number): string {
    return args[index] || "<<UNSET>>";
  }

  const command: StoryCommandPart = {
    type: "command",
    command: commandName,
    arguments: args,
    code: "",
  };

  if (commandName === "CreatePortrait") {
    command.code = `MM.CreateCharacter("${getArg(0)}", MomentManager.PortraitPosition.${getArg(1)});\n`;
    return command;
  } else if (commandName === "FadePrtraitIn") {
    command.code = `MM.FadePortaitIn("${getArg(0)}");\n`;
    return command;
  } else if (commandName === "SetFaceExpression") {
    command.code = `MM.SetCharacterFacialExpression("${getArg(0)}", CharacterFacialExpressions.${getArg(1)});\n`;
    return command;
  } else if (commandName === "ChangeBackground") {
    command.code = `MM.FadeBackgroundIn(MomentManager.BackgroundNames.${getArg(0)});\n`;
    return command;
  }

  return null;
}