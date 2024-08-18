import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./TodoItem.module.css";

const TodoItem = (props) => {
  const { details, onDeleteTodoCount, onUpdateTodoCount } = props;
  const { todo_id, newtitle, count, todo } = details;
  const onDeleteTodo = () => {
    onDeleteTodoCount(todo_id);
  };
  const onUpdateTodo = () => {
    onUpdateTodoCount(todo_id);
  };
  return (
    <li className={styles.val}>
      <p className={styles.para}>{todo}</p>
      <div className={styles.val1}>
        <FontAwesomeIcon
          icon={faEdit}
          onClick={onUpdateTodo}
          className={styles.icon1}
        />
        <FontAwesomeIcon
          icon={faTimes}
          onClick={onDeleteTodo}
          className={styles.icon}
        />
      </div>
    </li>
  );
};

export default TodoItem;
