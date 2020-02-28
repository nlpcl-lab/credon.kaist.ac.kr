import React from 'react';
import { Redirect, Route, routerRedux, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

import App from './routes/app';

const { ConnectedRouter } = routerRedux;

export const routes = [
  {
    path: '/',
    component: () => import('./routes/main'),
  },
  {
    path: '/404',
    component: () => import('./routes/404'),
  },
];

export default function ({ history, app }) {
  history.listen((location, action) => {

  });
  const error = dynamic({
    app,
  });

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          {
            routes.map(({ path, ...dynamics }, key) => {
              return (
                <Route
                  key={key}
                  exact
                  path={path}
                  component={dynamic({
                    app,
                    ...dynamics,
                  })}
                />);
            })
          }
          <Route component={error}/>
        </Switch>
      </App>
    </ConnectedRouter>
  );
}
