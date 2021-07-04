import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

interface Props {
  color: string;
  onRemove: (color: string) => any;
  onClick: (color: string) => any;
}

const Color: React.FC<Props> = ({ color, onRemove, onClick }) => {
  return (
    <Box
      display="flex"
      borderColor="black"
      border="1px solid black"
      borderRadius="1000px 0 0 1000px"
    >
      <Box
        borderRadius="1000px 0 0 1000px"
        flexGrow="1"
        onClick={() => onClick(color)}
        style={{
          backgroundColor: color,
        }}
      />
      <Button onClick={() => onRemove(color)} color="primary">
        <CloseIcon />
      </Button>
    </Box>
  );
};

export default Color;
