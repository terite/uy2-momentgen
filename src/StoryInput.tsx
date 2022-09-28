interface Props {
  rawText: string;
  onRawTextChange: (newRawText: string) => void;
}

export const StoryInput: React.FC<Props> = ({ rawText, onRawTextChange }) => {
  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onRawTextChange(event.target.value);
  };

  return <div className="StoryInput">
    <textarea value={rawText} onChange={onChangeHandler} />
  </div>;
}

