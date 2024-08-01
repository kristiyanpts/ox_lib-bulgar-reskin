import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Avatar, Box, createStyles, Group, keyframes, Stack, Text } from '@mantine/core';
import React, { Attributes, useRef } from 'react';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    width: 350,
    height: 'fit-content',
    backgroundColor: theme.colors.dark[6],
    color: theme.colors.dark[0],
    padding: 12,
    borderRadius: 5,
    fontFamily: 'Roboto',
    boxShadow: theme.shadows.sm,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 500,
    lineHeight: 'normal',
    color: 'white',
  },
  description: {
    fontSize: 12,
    // color: theme.colors.dark[2],
    color: 'white',
    fontFamily: 'Roboto',
    lineHeight: 'normal',
  },
  descriptionOnly: {
    fontSize: 14,
    // color: theme.colors.dark[2],
    color: 'white',
    fontFamily: 'Roboto',
    lineHeight: 'normal',
  },
  notifyTimer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    transform: 'scale(1.4) rotate(-90deg)',
  },
}));

// I hate this
const enterAnimationTop = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(-30px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
});

const enterAnimationBottom = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(30px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
});

const exitAnimationTop = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(-100%)',
  },
});

const exitAnimationRight = keyframes({
  from: {
    opacity: 1,
    transform: 'translateX(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(100%)',
  },
});

const exitAnimationLeft = keyframes({
  from: {
    opacity: 1,
    transform: 'translateX(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(-100%)',
  },
});

const exitAnimationBottom = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(100%)',
  },
});

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const timerElement = useRef(null);

  // Function to update the progress
  function updateProgress(progress: number) {
    // Calculate the dashoffset value
    const circumference = 2 * Math.PI * 5; // Assuming radius is 5
    const offset = (1 - progress / 100) * circumference;

    // Update the stroke-dashoffset to simulate fill
    // @ts-ignore
    timerElement.current?.setAttribute('stroke-dashoffset', offset);
  }

  // Start the timer
  function startTimer(time: number) {
    const totalTime = time;
    let remainingTime = totalTime;
    const intervalTime = 500; // Update every 100 ms

    const interval = setInterval(() => {
      remainingTime -= intervalTime; // Subtract the interval time from the remaining time

      // Calculate the progress as a percentage
      const progress = ((totalTime - remainingTime) / totalTime) * 100;

      // Update the circle progress
      updateProgress(100 - progress); // Subtract progress from 100 to unfill the circle

      if (remainingTime <= 0) {
        clearInterval(interval); // Stop the timer when the remaining time reaches zero
        updateProgress(0); // Ensure the circle is fully unfilled
      }
    }, intervalTime);
  }

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;
    // Backwards compat with old notifications
    let position = data.position;
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }
    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }
    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: t.visible
              ? `${position?.includes('bottom') ? enterAnimationBottom : enterAnimationTop} 0.2s ease-out forwards`
              : `${
                  position?.includes('right')
                    ? exitAnimationRight
                    : position?.includes('left')
                    ? exitAnimationLeft
                    : position === 'top-center'
                    ? exitAnimationTop
                    : position
                    ? exitAnimationBottom
                    : exitAnimationRight
                } 0.4s ease-in forwards`,
            ...data.style,
            backgroundColor:
              data.type === 'error'
                ? 'rgb(51, 0, 0)'
                : data.type === 'success'
                ? 'rgb(29, 94, 63)'
                : data.type === 'warning'
                ? 'rgb(135, 135, 16)'
                : 'rgb(31, 90, 128)',
          }}
          className={`${classes.container}`}
        >
          <Group noWrap spacing={12}>
            {data.icon && (
              <>
                {!data.iconColor ? (
                  <Avatar
                    color={
                      data.type === 'error'
                        ? 'red'
                        : data.type === 'success'
                        ? 'teal'
                        : data.type === 'warning'
                        ? 'yellow'
                        : 'blue'
                    }
                    style={{
                      alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                      textShadow: '0px 0px 50px rgba(255,0,0,0.6);',
                    }}
                    radius="xl"
                    size={32}
                  >
                    <LibIcon icon={data.icon} fixedWidth size="lg" animation={data.iconAnimation} />
                  </Avatar>
                ) : (
                  <LibIcon
                    icon={data.icon}
                    animation={data.iconAnimation}
                    style={{
                      color: data.iconColor,
                      alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                      textShadow: '0px 0px 50px rgba(255,0,0,0.6);',
                    }}
                    fixedWidth
                    size="lg"
                  />
                )}
              </>
            )}
            <Stack spacing={0}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
            <div className={classes.notifyTimer}>
              <svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.5" cy="7.5" r="5" fill="none" stroke="white" strokeOpacity="0.17" strokeWidth="1.5" />
                <circle
                  className="progressCircle"
                  cx="7.5"
                  cy="7.5"
                  r="5"
                  fill="none"
                  stroke={
                    data.type === 'error'
                      ? 'rgb(179, 0, 0)'
                      : data.type === 'success'
                      ? 'rgb(61, 196, 131)'
                      : data.type === 'warning'
                      ? 'rgb(237, 237, 28)'
                      : 'rgb(56, 162, 229)'
                  }
                  strokeWidth="1.5"
                  strokeDasharray="31.41592653589793"
                  strokeDashoffset="31.41592653589793"
                  ref={timerElement}
                />
              </svg>
            </div>
          </Group>
        </Box>
      ),
      {
        id: data.id?.toString(),
        duration: data.duration || 3000,
        position: position || 'top-center',
      }
    );
    startTimer(data.duration || 3000);
  });

  return <Toaster />;
};

export default Notifications;
