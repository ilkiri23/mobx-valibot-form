import { Link } from "wouter";

export function AppHeader() {
  return (
    <ul>
      <li><Link to="/native-form">Native form</Link></li>
      <li><Link to="/custom-errors">Form with custom errors</Link></li>
      <li><Link to="/dynamic-fields">Form with dynamic fields</Link></li>
      <li><Link to="/mantine-integration">Mantine Integration</Link></li>
    </ul>
  )
}