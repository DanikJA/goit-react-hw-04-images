import './Button.css';

export const Button = props => {
  return (
    <button className="button-load" onClick={props.onClick}>
      Load more
    </button>
  );
};
