import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BlogPreviewer from './blogPreviewer';
import SearchableTranscription from './searchableTranscription';
import CopyToClipboard from 'react-copy-to-clipboard';
import Icon from '../icons';
import { OpenAIApi, Configuration } from 'openai';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const StyledTranscriptionSummary = styled.div`
  background-color: var(--light-navy);
  width: 100%;
  .content {
    color: var(--dark-white);
  }

  svg.a {
    width: 10%;
    min-width: 20px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #999999;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #999999;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface TranscriptionSummaryProps {
  caption: Array<Caption>;
  loading: boolean;
  prompt: string;
  onChangedCaption: Function;
  progress: string | number;
}

const TranscriptionSummary = ({
  caption,
  loading,
  prompt,
  onChangedCaption,
  progress,
}: TranscriptionSummaryProps) => {
  const [transcriptionCopied, setTranscriptionCopied] =
    useState<boolean>(false);
  const [summaryCopied, setSummaryCopied] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [selectedTrans, setSelectedTrans] = useState<boolean>(false);
  const [selectedSum, setSelectedSum] = useState<boolean>(true);
  const [contentTranscription, setContentTranscription] = useState<string>('');
  const [contentSummary, setContentSummary] = useState<string>('');
  const [summaryTitle, setSummaryTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const [captionEditing, setCaptionEditing] = useState<boolean>(false);
  const [summaryEditing, setSummaryEditing] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setQuery(input);
  };

  useEffect(() => {
    setContentSummary(prompt);
    if (prompt) {
      const openaiCmd = `Create a blog post with headings and sections based on the following ${prompt}. Make it 400 words in length.`;
      openai
        .createCompletion({
          model: 'text-davinci-003',
          prompt: openaiCmd,
          max_tokens: 535,
        })
        .then((completion) => {
          const text = completion.data.choices[0].text;
          setContentSummary(text!);
        })
        .catch((error) => console.log(error));
    }
  }, [prompt]);

  useEffect(() => {
    setCaptionEditing(false);
    setSummaryEditing(false);
  }, [active]);

  return (
    <StyledTranscriptionSummary className="relative flex-row h-full rounded-2xl">
      {loading ? (
        <div className="w-full h-full absolute bg-[#000d] z-10 flex flex-col justify-center items-center rounded-2xl">
          <CircularProgressbar
            className="a"
            value={parseInt(String(progress))}
            text={`${parseInt(String(progress))}%`}
            strokeWidth={3}
            styles={buildStyles({
              textColor: 'white',
              pathColor: 'white',
              trailColor: '#2e2e2e',
            })}
          />
        </div>
      ) : null}
      <div className="flex pt-[14px] pb-[5px] w-full justify-between">
        <div className="flex px-3 w-fit">
          <button
            className={`text-[20px] text-white ${
              selectedTrans ? 'bg-[#0075FF]' : 'bg-none'
            }`}
            onClick={() => {
              setActive(true);
              setSelectedTrans(!selectedTrans);
              setSelectedSum(false);
            }}
          >
            Transcription
          </button>
          <button
            className={`text-[20px] text-white ${
              selectedSum ? 'bg-[#0075FF]' : 'bg-none'
            }`}
            onClick={() => {
              setActive(false);
              setSelectedSum(!selectedSum);
              setSelectedTrans(false);
            }}
          >
            Summary
          </button>
        </div>
        <div className="flex pt-[8px] gap-3">
          <div>
            <input
              type="text"
              placeholder=""
              value={query!}
              onChange={handleInputChange}
              className="bg-[#2e2e2e] border-[#999999] border rounded-[4px] content text-[14px] w-full h-[25px] min-w-[60px]"
            />
          </div>
          {active ? (
            <div className="flex pr-[20px]">
              <div className="pr-[10px]">
                <CopyToClipboard
                  text={contentTranscription}
                  onCopy={() => {
                    setTranscriptionCopied(true);
                    window.setTimeout(() => {
                      setTranscriptionCopied(false);
                    }, 1000);
                  }}
                >
                  <Icon name={transcriptionCopied ? 'check' : 'copy'} />
                </CopyToClipboard>
              </div>
              <div onClick={() => setCaptionEditing(!captionEditing)}>
                <Icon name="edit" />
              </div>
            </div>
          ) : (
            <div className="flex pr-[20px]">
              <div className="pr-[10px]">
                <CopyToClipboard
                  text={prompt || ''}
                  onCopy={() => {
                    setSummaryCopied(true);
                    window.setTimeout(() => {
                      setSummaryCopied(false);
                    }, 1000);
                  }}
                >
                  <Icon name={summaryCopied ? 'check' : 'copy'} />
                </CopyToClipboard>
              </div>
              <div onClick={() => setSummaryEditing(!summaryEditing)}>
                <Icon name="edit" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full overflow-y-auto h-[200px]">
        {active ? (
          <SearchableTranscription
            original={caption}
            isEditing={captionEditing}
            onFinishEdition={() => setCaptionEditing(false)}
            onChangedCaption={onChangedCaption}
          />
        ) : (
          <BlogPreviewer
            summary={contentSummary || ''}
            title={summaryTitle}
            isEditing={summaryEditing}
            onChangedTitle={setSummaryTitle}
            onChangedSummary={setContentSummary}
            onFinishEdition={() => setSummaryEditing(false)}
          />
        )}
      </div>
    </StyledTranscriptionSummary>
  );
};

export default TranscriptionSummary;
