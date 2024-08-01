import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugTextUI = () => {
  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        text: 'Влез',
        position: 'right-center',
        icon: 'door-open',
        keybind: 'E',
      },
    },
  ]);
};
