import { Link } from 'react-router-dom';
import ReactiveButton from 'reactive-button';

    function CallToActionButton({toTop}) {
    

    return (<>
    <Link to="/cities" className="call-to-action">

        <div className="adventure-btn-ctn">
        <ReactiveButton 
            color={'teal'}
            idleText={"YOUR ADVENTURE STARTS HERE!"}
            type={'button'}
            className={'class1 class2'}
            style={{ borderRadius: '5px' }}
            outline={true}
            shadow={true}
            rounded={true}
            size={'large'}
            block={false}
            buttonRef={null}
            width={"30vw"}
            height={"10vh"} 

            onClick={toTop}
            />
            </div>
            
         <div className="click-here"style={{backgroundImage:"url('./assets/clickhere.png')", backgroundSize:'contain'}} 
         onClick={toTop}
         />
    </Link>

        </>
    );
}

export default CallToActionButton;