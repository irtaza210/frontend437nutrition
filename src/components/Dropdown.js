import React, {Component} from "react";
import './Dropdown.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';

class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isListOpen: false,
            headerTitle: this.props.title
          }
        this.toggleList = this.toggleList.bind(this);

    }

    render() {
        const { isListOpen, headerTitle } = this.state;
        const { list } = this.props;
        
        return (
            <div className="dd-wrapper">
              <Button variant="contained" id = "dd-header" className="dd-header" onClick={this.toggleList} >
                <div className="dd-header-title">{headerTitle}</div>
                
                  {isListOpen
                  ? <FontAwesomeIcon icon={faAngleUp} />
                  : <FontAwesomeIcon icon={faAngleDown} />}
              </Button> <br></br><br></br><br></br>
              {isListOpen && (
                <div role="list" className="dd-list">
                  {list.map((item) => (
                    <Button variant="outlined" id = "dd-list-item" className="dd-list-item" key={item.id} onClick={(e) => {
                        e.stopPropagation();
                        this.selectItem(item);
                      }}><strong>
                      {item.title}
                      </strong>
                      {' '}
                      {/* {item.selected && <FontAwesomeIcon icon={faCheck} />} */}
                      {item.selected}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );


    }

    componentDidUpdate(){
        const { isListOpen } = this.state;
      
        setTimeout(() => {
          if(isListOpen){
            window.addEventListener('click', this.close)
          }
          else{
            window.removeEventListener('click', this.close)
          }
        }, 0)
    }

    close = () => {
        this.setState({
          isListOpen: false,
        });
      }

    toggleList = () => {
        this.setState(prevState => ({
          isListOpen: !prevState.isListOpen
       }));
    }
    // Updates the state and calls resetThenSet() to update the 'location' state in parent and
    //  mark the clicked item as selected.
    selectItem = (item) => {
        const { resetThenSet } = this.props;
        const { title, id, key } = item;
      
        this.setState({
          headerTitle: title,
          isListOpen: true,//changed to true to keep dropdown open after first click
        }, () => resetThenSet(id, key));
    }

    static getDerivedStateFromProps(nextProps) {
        const { list, title } = nextProps;
        const selectedItem = list.filter((item) => item.selected);
      
        if (selectedItem.length) {
          return {
            headerTitle: selectedItem[0].title,
          };
        }
        return { headerTitle: title };
      }


}

export default Dropdown;