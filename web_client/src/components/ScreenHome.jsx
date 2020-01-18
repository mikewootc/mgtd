'use strict'

import React                            from 'react';
import { inject, observer }             from "mobx-react"

@inject('todo')
@observer
class ScreenHome extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        let dicTodos = this.props.todo.dicTodos;
        return (
            <div style={ss.box}>
                <ul>
                    { Object.keys(dicTodos).map((key) => (<li key={ key }>{ dicTodos[key].title }</li>)) }
                </ul>
            </div>
        )
    }
}

const ss = {
    box: {
        display             : 'flex',
        flexDirection       : 'column',
        justifyContent      : 'center',
        alignItems          : 'center',
        height              : '100%',
    },
}

export default ScreenHome;
