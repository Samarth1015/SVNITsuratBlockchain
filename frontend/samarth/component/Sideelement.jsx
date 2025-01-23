import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
export default function Sideelement() {
  return (
    <div className="flex ">
      <Nav>
        <Nav.Item className="size-10" eventKey="1" icon={<DashboardIcon />}>
          Dashboard
        </Nav.Item>
        <br />
        <Nav.Item className="size-10" eventKey="2" icon={<DashboardIcon />}>
          View History
        </Nav.Item>
        <br />
        <Nav.Item className="size-10" eventKey="1" icon={<DashboardIcon />}>
          Share access with someone
        </Nav.Item>
        <br />
        <Nav.Item className="size-10" eventKey="1" icon={<DashboardIcon />}>
          remove access
        </Nav.Item>
        <br />
        <Nav.Item className="size-10" eventKey="1" icon={<DashboardIcon />}>
          Share your connection string
        </Nav.Item>
        <br />
      </Nav>
    </div>
  );
}
