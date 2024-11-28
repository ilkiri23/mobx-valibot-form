import { Switch, Route, Redirect } from 'wouter'
import { MantineProvider } from '@mantine/core'
import { NativeForm } from './examples/native-form'
import { FormWithDynamicFields } from './examples/advanced/dynamic-fields'
import { FormWithCustomErrors } from './examples/advanced/custom-errors'
import { MantineIntegration } from './examples/mantine-integration'
import { AppHeader } from './AppHeader'
import '@mantine/core/styles.css'


function App() {
  return (
    <div>
      <AppHeader />
      <Switch>
        <Route path="/native-form" component={NativeForm} />
        <Route path="/dynamic-fields" component={FormWithDynamicFields} />
        <Route path="/custom-errors" component={FormWithCustomErrors} />

{/*          <Route path="/mantine-integration">
            <MantineProvider>
              <MantineIntegration />
            </MantineProvider>
          </Route>
        */}
        <Route>
          <Redirect to="/native-form" />
        </Route>
      </Switch>
    </div>
  )
}

export default App