// Text components act as our text spans
// One should be used when there is a need for the user to do something.
import { Component } from '../types';

interface TextProps extends React.ComponentProps<'span'>, Component {}

const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return <span style={style} {...props} />;
};

export default Text;
