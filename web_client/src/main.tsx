import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';

const Logger = require('cpclog');
//import Logger from 'cpclog';

const logger = Logger.createWrapper('main', Logger.LEVEL_DEBUG);


//import ScreenLoginCtn from './containers/ScreenLoginCtn.js';
import store                            from './models/RootStore';
import ScreenHome                       from './components/ScreenHome';

import 'antd/dist/antd.css';

//console.log('store:', store);

(async () => {
    try {
        let ret = await store.init();
    } catch(err) {
        console.log(err);
    }
})();

render(
    <Provider {...store}>
        <HashRouter>
            <div style={ {width: '100%', height: '100%', overflow: 'hidden'} } >
                <Route exact path="/" component={ ScreenHome }/>
                {/* <Route path="/home" component={ ScreenHomeCtn }/> */}
            </div>
        </HashRouter>
    </Provider>
    , document.getElementById('content')
);

// service worker
logger.debug('Check serviceWorker');
if ('serviceWorker' in navigator) {
    logger.debug('has serviceWorker');
    window.addEventListener('load', async function () {
        try {
            logger.debug('register serviceWorker');
            const registration = await navigator.serviceWorker.register('/public/sw.js', {scope: '/public/'});
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        } catch(err) {
            logger.error('ServiceWorker registration failed:', err);
        }
    });
}

