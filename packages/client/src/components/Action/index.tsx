// Action components act as our Buttons
// One should be used when there is a need for the user to do something.
import { Component } from '../types';

interface ActionProps extends React.ComponentProps<'button'>, Component {}

const Action: React.FC<ActionProps> = ({ style, ...props }) => {
  return <button style={style} {...props} />;
};

export default Action;
