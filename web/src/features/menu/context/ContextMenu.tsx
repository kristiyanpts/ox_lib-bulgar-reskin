import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  contextMenu: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    top: '50%',
    right: '15%',
    transform: 'translateY(-50%)',
    width: 310,
    height: '70vh',
    overflowY: 'auto',
  },
  header: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: '5px',
    overflow: 'hidden',
    background: 'radial-gradient(ellipse, rgba(122, 122, 122, 0.9) 0%, rgba(148, 148, 148, 0.5) 85%)',
    border: '1px solid lightgray',
    color: 'white',
  },
  titleContainer: {
    flex: '1 85%',
    backgroundColor: 'transparent',
    height: 50,
  },
  titleText: {
    position: 'relative',
    height: '100%',
    textShadow: '0px 0px 100px white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  buttonsContainer: {
    height: 'fit-content',
    overflowY: 'scroll',
  },
  buttonsFlexWrapper: {
    gap: 4,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <div
      className={classes.contextMenu}
      style={{
        background: visible
          ? 'linear-gradient(90deg, rgba(56, 162, 229,0) 0%,  rgba(24, 72, 102, 1) 90%)'
          : 'transparent',
      }}
    >
      <Box className={classes.container}>
        <ScaleFade visible={visible}>
          <Flex className={classes.header}>
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
            </Box>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
          </Flex>
          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </Stack>
          </Box>
        </ScaleFade>
      </Box>
    </div>
  );
};

export default ContextMenu;
