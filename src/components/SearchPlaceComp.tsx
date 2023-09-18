import React, { useState } from "react"
import { Button, Form } from "react-bootstrap"

interface ISearchPlaceProps {
    onSearchPlace: (query: string) => void
}

const SearchPlaceComp: React.FC<ISearchPlaceProps> = ({ onSearchPlace }) => {
    const [sPlaceInput, setPlaceInput] = useState("")

    const handlePlaceFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!sPlaceInput.trim().length) {
            return
        }

        onSearchPlace(sPlaceInput)
    }

    return (
        <Form id="form" className="sForm d-flex" onSubmit={handlePlaceFormSubmit}>
            <Form.Group>
                <Form.Control
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => setPlaceInput(e.target.value)}
                    type="text"
                    placeholder="Track Places"
                    required
                    value={sPlaceInput}
                />
            </Form.Group>
            <Button
                style={{ background: "black" }}
                variant="success"
                type="submit"
                className="submit-btn"
                disabled={!sPlaceInput.trim().length}
            >
                Track
            </Button>
        </Form>
    )
}

export default SearchPlaceComp
