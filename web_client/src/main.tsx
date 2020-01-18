import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';

//import ScreenLoginCtn from './containers/ScreenLoginCtn.js';
import store                            from './models/RootStore';
import ScreenHome                       from './components/ScreenHome';

//console.log('store:', store);

render(
    <Provider {...store}>
        <HashRouter>
            <div style={{width: '100%', height: '100%', backgroundColor: '#bbb'}} >
                <Route exact path="/" component={ ScreenHome }/>
                {/* <Route path="/home" component={ ScreenHomeCtn }/> */}
            </div>
        </HashRouter>
    </Provider>
    , document.getElementById('content')
);


