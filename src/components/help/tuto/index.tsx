import { Heading, Card } from "evergreen-ui";

interface TutoProps {
  title: string;
  children: React.ReactNode;
}

function Tuto({ title, children }: TutoProps) {
  return (
    <Card
      backgroundColor="white"
      elevation={1}
      display="flex"
      flexDirection="column"
      marginBottom={16}
      padding={16}
    >
      <Heading is="h2">{title}</Heading>
      {children}
    </Card>
  );
}

export default Tuto;
