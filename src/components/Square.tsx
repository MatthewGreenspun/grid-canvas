interface Props {
  color: string;
  id: number;
  mouseIsDown: boolean;
  border: boolean;
  onColor: (id: number) => any;
}

const Square: React.FC<Props> = ({
  color,
  id,
  onColor,
  mouseIsDown,
  border,
}) => {
  return (
    <div
      className="square"
      style={{
        backgroundColor: color,
        border: border ? "1px solid black" : "",
      }}
      onMouseOver={() => (mouseIsDown ? onColor(id) : 0)}
      onClick={() => onColor(id)}
    />
  );
};

export default Square;
