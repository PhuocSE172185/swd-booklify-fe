import'./TitileTypeOne.css'
import victor from '../../assets/victor.png'

export default function TitileTypeOne({Classname,Title,TitleTop}) {
  return (
    <div className={`titleTypeOne ${Classname}`}>
        <small>{TitleTop}</small>
        <div className='heading-H'>
            <h2>{Title}</h2>
            <div className ="line"></div>
        </div>

        <img src={victor } alt="" className='victor'/>
        </div>
  )
}
