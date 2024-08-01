import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import { before } from 'node:test';

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    // alignItems: params.position === 'top-center' ? 'baseline' : params.position === 'bottom-center' ? 'end' : 'center',
    alignItems: 'end',
    // justifyContent:
    //   params.position === 'right-center' ? 'flex-end' : params.position === 'left-center' ? 'flex-start' : 'center',
    justifyContent: 'center',
  },
  container: {
    fontSize: 16,
    padding: 12,
    margin: 8,
    color: theme.colors.dark[0],
    fontFamily: 'Roboto',
    boxShadow: theme.shadows.sm,
    backgroundColor: '#252934',
    borderRadius: '3px',
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'bottom-center',
    keybind: 'E',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    // if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box className="textui">
            <div className="textui-keybind-container">
              <div className="textui-keybind">
                <p>{data.keybind}</p>
              </div>
            </div>
            <Box style={data.style} className="textui-container">
              {/* {data.icon && (
                  <LibIcon
                    icon={data.icon}
                    fixedWidth
                    size="lg"
                    animation={data.iconAnimation}
                    style={{
                      color: data.iconColor,
                      alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                    }}
                  />
                )} */}
              {/* <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                {data.text}
              </ReactMarkdown> */}
              <p>{data.text}</p>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
