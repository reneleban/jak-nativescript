import { LoginComponent } from "./pages/login/login.component";
import { ListComponent } from "./pages/list/list.component";
import { CardComponent } from "./pages/card/card.component";

export const routes = [
  { path: "", component: LoginComponent },
  { path: "list", component: ListComponent }
];

export const navigatableComponents = [
  LoginComponent,
  ListComponent,
  CardComponent
];
