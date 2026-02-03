import { Heading, Pane, IconButton } from "evergreen-ui";
import { ElementType } from "react";

interface SubTutoProps {
  title: string;
  icon?: ElementType<any>;
  children: React.ReactNode;
}

function SubTuto({ title, icon, children }: SubTutoProps) {
  return (
    <Pane marginTop={16}>
      <Heading display="flex" alignItems="center">
        {title} {icon && <IconButton marginLeft={8} icon={icon} />}
      </Heading>
      {children}
    </Pane>
  );
}

export default SubTuto;
