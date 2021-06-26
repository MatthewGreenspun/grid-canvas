interface Props {
  color: string;
  onRemove: (color: string) => any;
  onClick: (color: string) => any;
}

const Color: React.FC<Props> = ({ color, onRemove, onClick }) => {
  return (
    <div className="color-container">
      <div
        onClick={() => onClick(color)}
        style={{
          width: "30px",
          backgroundColor: color,
          border: "1px solid black",
        }}
      />
      <button onClick={() => onRemove(color)}>X</button>
    </div>
  );
};

export default Color;
