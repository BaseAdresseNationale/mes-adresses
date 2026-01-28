import { Heading, Pane } from "evergreen-ui";

interface ProblemsProps {
  children: React.ReactNode;
}

function Problems({ children }: ProblemsProps) {
  return (
    <Pane
      borderLeft="default"
      float="left"
      marginBottom={8}
      padding={8}
      display="flex"
      flexDirection="column"
    >
      <Heading is="h2">Vous rencontrez un problème ?</Heading>
      <Pane margin={8}>{children}</Pane>
    </Pane>
  );
}

export default Problems;
