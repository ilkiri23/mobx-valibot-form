import { Switch, Route, Redirect } from 'wouter'
import { NativeForm } from './examples/native-form'
import { FormWithDynamicFields } from './examples/advanced/dynamic-fields'
import { FormWithCustomErrors } from './examples/advanced/custom-errors'
import { AppHeader } from './AppHeader'


function App() {
  return (
    <div>
      <AppHeader />
      <Switch>
        <Route path="/native-form" component={NativeForm} />
        <Route path="/dynamic-fields" component={FormWithDynamicFields} />
        <Route path="/custom-errors" component={FormWithCustomErrors} />

        <Route>
          <Redirect to="/native-form" />
        </Route>
      </Switch>
    </div>
  )
}

export default App