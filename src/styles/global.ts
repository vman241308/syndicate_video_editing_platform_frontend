import { createGlobalStyle } from 'styled-components';
import variables from './variables';

const GlobalStyle = createGlobalStyle`
    ${variables};

    html {
        box-sizing: border-box;
        width: 100%;
        scroll-behavior: smooth;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      ::selection {
        background-color: var(--lightest-navy);
        color: var(--lightest-slate);
      }

      /* Provide basic, default focus styles.*/
      :focus {
        // outline: 2px dashed var(--green);
        // outline-offset: 3px;
        outline: none;
        outline-offset: 0px;
      }

      /*
        Remove default focus styles for mouse users ONLY if
        :focus-visible is supported on this platform.
      */
      :focus:not(:focus-visible) {
        outline: none;
        outline-offset: 0px;
      }

      /*
        Optionally: If :focus-visible is supported on this
        platform, provide enhanced focus styles for keyboard
        focus.
      */
      :focus-visible {
        // outline: 2px dashed var(--green);
        // outline-offset: 3px;
        outline: none;
        outline-offset: 0px;
      }

      /* Scrollbar Styles */
      html {
        scrollbar-width: thin;
        scrollbar-color: var(--dark-slate) var(--navy);
      }
      ::-webkit-scrollbar {
        width: 12px;
      }
      ::-webkit-scrollbar-track {
        background: var(--navy);
      }
      ::-webkit-scrollbar-thumb {
        background-color: var(--dark-slate);
        border: 3px solid var(--navy);
        border-radius: 10px;
      }

      body {
        margin: 0;
        width: 100%;
        min-height: 100%;
        overflow-x: hidden;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        background-color: var(--navy);
        color: var(--white);
        fill: var(--white);
        font-family: var(--font-sans);
        font-size: var(--fz-xl);
        line-height: 1.3;

        header {
          background-color: var(--light-navy);
          position: fixed;
          width: var(--nav-height);
          height: 100vh;
          left: 0px;
          top: 0px;
        }

        @media (max-width: 480px) {
          font-size: var(--fz-lg);
        }

        &.hidden {
          overflow: hidden;
        }

        &.blur {
          overflow: hidden;

          header {
            background-color: var(--light-navy);
            position: fixed;
            width: var(--nav-height);
            height: 100vh;
            left: 0px;
            top: 0px;
          }

          #content > * {
            filter: blur(5px) brightness(0.7);
            transition: var(--transition);
            pointer-events: none;
            user-select: none;
          }
        }
      }

      #root {
        min-height: 100vh;
        display: grid;
        grid-template-rows: 1fr auto;
        grid-template-columns: 100%;
      }

      main {
        width: 100%;
        // max-width: 1440px;
        height: 100vh;
        padding-left: var(--nav-height);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0 0 10px 0;
        font-weight: 600;
        color: var(--lightest-slate);
        line-height: 1.1;
      }

      .big-heading {
        margin: 0;
        font-size: clamp(40px, 8vw, 80px);
      }

      .medium-heading {
        margin: 0;
        font-size: clamp(40px, 8vw, 60px);
      }

      .numbered-heading {
        display: flex;
        align-items: center;
        position: relative;
        margin: 10px 0 40px;
        width: 100%;
        font-size: clamp(26px, 5vw, var(--fz-heading));
        white-space: nowrap;

        &:before {
          position: relative;
          bottom: 4px;
          counter-increment: section;
          content: '0' counter(section) '.';
          margin-right: 10px;
          color: var(--green);
          font-family: var(--font-mono);
          font-size: clamp(var(--fz-md), 3vw, var(--fz-xl));
          font-weight: 400;

          @media (max-width: 480px) {
            margin-bottom: -3px;
            margin-right: 5px;
          }
        }

        &:after {
          content: '';
          display: block;
          position: relative;
          top: -5px;
          width: 300px;
          height: 1px;
          margin-left: 20px;
          background-color: var(--lightest-navy);

          @media (max-width: 1080px) {
            width: 200px;
          }
          @media (max-width: 768px) {
            width: 100%;
          }
          @media (max-width: 600px) {
            margin-left: 10px;
          }
        }
      }

      a {
        display: inline-block;
        text-decoration: none;
        text-decoration-skip-ink: auto;
        color: inherit;
        position: relative;
        transition: var(--transition);

        &:hover,
        &:focus {
          color: var(--green);
        }

        &.inline-link {
          ${({ theme }: { theme: any }) => theme.mixins.inlineLink};
        }
      }

      button {
        cursor: pointer;
        border-radius: 4px;
        height: fit-content;
        padding: 10px;
        background-color: transparent;

        &.selected {
          background-color: var(--lightest-navy);
        }
      }

      input, textarea {
        border-radius: 0;
        outline: 0;

        &:focus {
          outline: 0;
        }
        &:focus,
        &:active {
          &::placeholder {
            opacity: 0.5;
          }
        }
      }

      p {
        margin: 0 0 15px 0;

        &:last-child,
        &:last-of-type {
          margin: 0;
        }

        & > a {
          ${({ theme }: { theme: any }) => theme.mixins.inlineLink};
        }

        & > code {
          background-color: var(--light-navy);
          color: var(--white);
          font-size: var(--fz-sm);
          border-radius: var(--border-radius);
          padding: 0.3em 0.5em;
        }
      }

      ul {
        &.fancy-list {
          padding: 0;
          margin: 0;
          list-style: none;
          font-size: var(--fz-lg);
          li {
            position: relative;
            padding-left: 30px;
            margin-bottom: 10px;
            &:before {
              content: '▹';
              position: absolute;
              left: 0;
              color: var(--green);
            }
          }
        }
      }

      blockquote {
        border-left-color: var(--green);
        border-left-style: solid;
        border-left-width: 1px;
        margin-left: 0px;
        margin-right: 0px;
        padding-left: 1.5rem;

        p {
          font-style: italic;
          font-size: 24px;
        }
      }

      hr {
        background-color: var(--lightest-navy);
        height: 1px;
        border-width: 0px;
        border-style: initial;
        border-color: initial;
        border-image: initial;
        margin: 1rem;
      }

      code {
        font-family: var(--font-mono);
        font-size: var(--fz-md);
      }

      .skip-to-content {
        ${({ theme }: { theme: any }) => theme.mixins.button};
        position: absolute;
        top: auto;
        left: -999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: -99;

        &:focus,
        &:active {
          background-color: var(--green);
          color: var(--navy);
          top: 0;
          left: 0;
          width: auto;
          height: auto;
          overflow: auto;
          z-index: 99;
        }
      }

      #logo {
        color: var(--green);
      }

      .overline {
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-md);
        font-weight: 400;
      }

      .subtitle {
        color: var(--green);
        margin: 0 0 20px 0;
        font-size: var(--fz-md);
        font-family: var(--font-mono);
        font-weight: 400;
        line-height: 1.5;
        @media (max-width: 1080px) {
          font-size: var(--fz-sm);
        }
        @media (max-width: 768px) {
          font-size: var(--fz-xs);
        }

        a {
          ${({ theme }: { theme: any }) => theme.mixins.inlineLink};
          line-height: 1.5;
        }
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        color: var(--green);

        .arrow {
          display: block;
          margin-right: 10px;
          padding-top: 4px;
        }

        a {
          ${({ theme }: { theme: any }) => theme.mixins.inlineLink};
          font-family: var(--font-mono);
          font-size: var(--fz-sm);
          font-weight: 600;
          line-height: 1.5;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      }

      .gatsby-image-outer-wrapper {
        height: 100%;
      }

`;

export default GlobalStyle;
