import { DESCRIPTION, TITLE } from './constants';
import './style.css'
const Description: React.FC = () => {
  return (
    <div className="description">
      <h2> { TITLE } </h2>
      <p> { DESCRIPTION } </p>
    </div>
  );
}

export default Description;
