import { Pane, Text } from "evergreen-ui";

interface ProgressBarProps {
  percent: number;
}

function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <Pane display="flex" marginTop={15}>
      <Pane flex={1} height={35} background="gray500" borderRadius={5}>
        <Pane
          display="flex"
          alignItems="center"
          height={35}
          width={`${percent}%`}
          borderRadius={5}
          background="green500"
        />
      </Pane>
      <Text
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingLeft="15px"
        size={500}
      >
        <b>{percent} %</b>
      </Text>
    </Pane>
  );
}

export default ProgressBar;
