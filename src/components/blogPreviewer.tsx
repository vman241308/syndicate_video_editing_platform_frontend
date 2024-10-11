import styled from 'styled-components';
import { useEffect, useState } from 'react';
interface BlogPreviewerProps {
  summary: string;
  title: string;
  isEditing: boolean;
  onFinishEdition: Function;
  onChangedTitle: Function;
  onChangedSummary: Function;
}

const StyledBlogPreviewer = styled.div`
  background-color: var(--light-navy);
  width: 100%;
  height: 100%;
  .content {
    color: var(--dark-white);
  }

  button {
    background-color: transparent;
    border-radius: 2px;
    margin-right: 20px;
    font-size: 12px;
    height: fit-content;
    transition-duration: 0.4s;
    border-color: #999999;
    border-width: 1px;
  }
  .button:hover {
    background-color: #257bf5; /* Green */
    color: white;
    border-style: none;
  }
`;

const BlogPreviewer = ({
  summary,
  title,
  isEditing,
  onFinishEdition,
  onChangedSummary,
  onChangedTitle,
}: BlogPreviewerProps) => {
  const [tempContent, setTempContent] = useState<string>('');
  const [tempTitle, setTempTitle] = useState<string>('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value);
  };

  const handleSummaryChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTempContent(event.target.value);
  };

  useEffect(() => {
    setTempTitle(JSON.parse(JSON.stringify(title)));
  }, [title]);

  useEffect(() => {
    setTempContent(JSON.parse(JSON.stringify(summary)));
  }, [summary]);

  return (
    <StyledBlogPreviewer className="flex flex-col h-full rounded-2xl pl-[20px] pr-[20px] pb-10">
      {!isEditing ? (
        <div className="h-full overflow-y-auto">
          <p id="title" className="text-[18px]  text-white pl-4">
            {title}
          </p>
          <div id="content" className="text-[14px] content pl-6">
            {summary}
          </div>
        </div>
      ) : (
        <div className="h-full overflow-y-auto">
          <div className="flex-col border rounded-sm border-[#999999] h-full">
            <form className="w-full h-4/5">
              <input
                defaultValue={tempTitle}
                className="text-[18px] text-white content bg-[#2e2e2e] content w-full h-[25px] min-w-[60px]"
                onChange={handleTitleChange}
                placeholder="title"
              />
              <textarea
                defaultValue={tempContent}
                className="text-[14px] content bg-[#2e2e2e] h-full  w-full"
                onChange={handleSummaryChange}
              />
            </form>
          </div>
          <div className="flex float-right pt-[5px]">
            <button
              className="button"
              onClick={() => {
                onChangedSummary(summary);
                onChangedTitle(title);
                onFinishEdition();
              }}
            >
              Cancel
            </button>
            <button
              className="button"
              onClick={() => {
                onFinishEdition();
                onChangedTitle(tempTitle);
                onChangedSummary(tempContent);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </StyledBlogPreviewer>
  );
};

export default BlogPreviewer;
