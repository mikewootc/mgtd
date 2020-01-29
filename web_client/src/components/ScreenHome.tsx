'use strict'

import * as React                       from 'react';
import {inject, observer}               from 'mobx-react';
import TodoStore                        from '../models/TodoStore';
import UiStore                          from '../models/UiStore';
import {Button, Input, Checkbox}        from 'antd';
import { genPercentAdd } from 'antd/lib/upload/utils';

interface Props {
    todo: TodoStore,
    ui  : UiStore,
}

@inject('todo')
@inject('ui')
@observer
class ScreenHome extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
    }

    onNewTodoInputChange = (e:any) => {
        console.log('onInputNewTodoChange:', e);
        this.props.ui.data.screenHome.addTodoInputText = e.target.value;
    }

    /**
     * Submit addNewTodo
     * @memberof ScreenHome
     */
    onNewTodoSubmit = (e:any) => {
        console.log('onNewTodoSubmit:', this.props.ui.data.screenHome.addTodoInputText);
        //this.props.ui.data.screenHome.addTodoInputText = e.target.value;
        this.props.todo.addTodo(this.props.ui.data.screenHome.addTodoInputText);
    }

    /**
     * Click on todo's checkbox
     * @memberof ScreenHome
     */
    onCheckTodoItem = (todoId:string) => {
        let todo = this.props.todo.dicTodos[todoId];
        todo.toggleComplete();
    }

    removeTodo = (todoId:string) => {
        this.props.todo.removeTodo(todoId);
    }

    renderTodoList() {
        let dicTodos = this.props.todo.dicTodos;
        const ss:{[key: string]: Object} = {
            todoItemUl: {
                flex                    : '1 1 auto',
                padding                 : 0,
                listStyle               : 'none',
                width                   : '100%',

                // sub
                overflowY               : 'scroll',
            },

            todoItemLi: {
                borderColor             : '#CCCCCC',
                borderWidth             : 1,
                borderBottomStyle       : 'solid',
                listStyle               : 'none',
                height                  : 36,

                // sub
                display                 : 'flex',
                flexDirection           : 'row',
                justifyContent          : 'flex-start',
                alignItems              : 'center',
                width                   : '100%',
            },

            todoItemCheckbox: {
                width                   : 18,
                height                  : 18,
            },

            todoItemTitle: {
                paddingLeft             : 5,
            },
            todoItemTitleCompleted: {
                color                   : 'green',
            },

            todoItemDelete: {
                borderColor             : 'gray',
                borderWidth             : 1,
                borderRadius            : 2,
                borderStyle             : 'solid',
                marginLeft              : 5,
                width                   : 16,
                height                  : 16,
                cursor                  : 'pointer',

                display             : 'flex',
                flexDirection       : 'row',    /* row, column */
                justifyContent      : 'center', /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
                alignItems          : 'center', /* flex-start, center, flex-end, stretch */
            },
        }

        return (
                <ul style={ ss.todoItemUl }>
                    { Object.keys(dicTodos).map((id) => {
                        let todo = dicTodos[id];
                        let titleStyle:{[key: string]: Object} = todo.completed ? {...ss.todoItemTitle, ...ss.todoItemTitleCompleted} : ss.todoItemTitle;
                        return (
                            <li style={ ss.todoItemLi } key={ id }>
                                {/* <Checkbox onChange={ () => {this.onCheckTodoItem(id)} }></Checkbox> */}
                                <input style={ ss.todoItemCheckbox } type='checkbox' onChange={ () => {this.onCheckTodoItem(id)} } />
                                <span style={ titleStyle }> { todo.title } </span>
                                <span style={ ss.todoItemDelete } onClick={ () => {this.removeTodo(id)} }> X </span>
                            </li>
                        );
                    }) }
                </ul>
        );
    }

    render() {
        const ss:{[key: string]: Object} = {
            box: {
                padding                 : 10,
                height                  : '100%',

                // sub
                display                 : 'flex',
                flexDirection           : 'column',
                justifyContent          : 'flex-start',
                alignItems              : 'flex-start',
                overflow                : 'hidden',
            },

            addTodoBox: {
                display                 : 'flex',
                flexDirection           : 'row',
                justifyContent          : 'center',
                alignItems              : 'flex-start',
                width                   : '100%',
            },
        }

        return (
            <div id='screenHomeBox' style={ss.box}>
                { this.renderTodoList() }
                <div id='addTodoBox' style={ss.addTodoBox}>
                    <Input placeholder='Add a TODO' value={ this.props.ui.data.screenHome.addTodoInputText } onChange={ this.onNewTodoInputChange } onPressEnter={ this.onNewTodoSubmit } />
                    <Button style={ {fontSize: 20} } type='primary' onClick={ this.onNewTodoSubmit }>+</Button>
                </div>
            </div>
        )
    }
}

export default ScreenHome;
