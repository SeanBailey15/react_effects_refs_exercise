import {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";
import './Deck.css'

const Deck = () => {
    // Main URL to retrieve a new deck
    const newDeckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

    // State to hold a deck id
    const [deckId, setDeckId] = useState(null);

    // State tho hold remaining card count
    const[remaining, setRemaining] = useState(null);

    // State to display a card
    const [card, setCard] = useState(null);

    // State to limit button clicks during unresolved requests
    const [disabled, setDisabled] = useState(false);

    // Ref to reset the card display between shuffle and first drawn card
    const cardDisplay = useRef();

    // Ref to remember this deck id between shuffles
    // Allows us to display loading message when shuffling on slower networks
    const thisDeck = useRef();

    // Call the API using the deckId to draw a card
    const drawCard = async () => {
        try{
            setDisabled(true);
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${thisDeck.current}/draw/?count=1`);
            setCard(res.data.cards[0].image);
            setRemaining(res.data.remaining);
        } catch(err){
            console.error(err);
            alert(`Something went wrong! Refresh and try again.`);
        } finally {
            setDisabled(false)
        }
        
    }

    // Call the API using the deckId to shuffle the deck and begin over
    const shuffle = async () => {
        cardDisplay.current.innerHtml = "";
        try{
            setDisabled(true);
            setDeckId(null);
            setRemaining(null);
            setCard(null);
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${thisDeck.current}/shuffle/`);
            setDisabled(false);
            setDeckId(res.data.deck_id)
        } catch(err){
            console.error(err);
            alert(`Something went wrong! Refresh and try again.`);            
        }
    }

    // Effect to get a new deck Id
    useEffect(()=> {
        async function getDeckId(){
            try {
                const res = await axios.get(newDeckUrl);
                setDeckId(res.data.deck_id);
                thisDeck.current = res.data.deck_id;
            } catch(err){
                console.error(err);
                alert(`Something went wrong! Refresh and try again.`);
            }
        }
        getDeckId();

    },[])

    useEffect(() => {
        console.log(card);
        console.log(remaining);
    }, [card]);

    if(!deckId){
        return (
            <div className="Deck">
                <h1 className="Deck-load-msg">Loading...</h1>
            </div>
        );
    } else if(deckId &&  remaining === 0) {
        return (
            <div className="Deck">
                <h1 className="Deck-load-msg">No Cards Remaining!</h1>
                <button className="Deck-shuffle-btn" disabled={disabled} onClick={shuffle}>Shuffle The Deck</button>
                <div className="Deck-card" ref={cardDisplay}>
                    <Card image={card} />
                </div>
            </div>
        );
    } else if(deckId && disabled === true) {
        return (
            <div className="Deck">
                <h1 className="Deck-load-msg">Loading...</h1>
                <button className="Deck-draw-btn" disabled={disabled} onClick={drawCard}>Draw A Card</button>
                <div className="Deck-card" ref={cardDisplay}>
                    <Card image={card} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="Deck">
                <button className="Deck-draw-btn" disabled={disabled} onClick={drawCard}>Draw A Card</button>
                <div className="Deck-card" ref={cardDisplay}>
                    <Card image={card} />
                </div>
            </div>
        );
    };
};

export default Deck;