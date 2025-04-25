// Generic layout component;  all layouts should ideally use this to
// set a default layout and size.

import { Component } from '../types';

interface ContainerProps extends Component, React.ComponentProps<'div'> {
  column?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  style,
  column = false,
  ...props
}) => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: column ? 'column' : 'row',
      ...style,
    }}
    {...props}
  />
);

export default Container;
