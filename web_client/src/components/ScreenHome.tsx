'use strict'

import * as React                       from 'react';
import { inject, observer }             from 'mobx-react';
import TodoStore                        from '../models/TodoStore';

interface Props {
    todo: TodoStore,
}

@inject('todo')
@observer
class ScreenHome extends React.Component<Props> {
    constructor(props: Props) {
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

const ss:{[key: string]: Object} = {
    box: {
        display             : 'flex',
        flexDirection       : 'column',
        justifyContent      : 'center',
        alignItems          : 'center',
        height              : '100%',
    },
}

export default ScreenHome;
