import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import Label from "../../components/label/label.component";
import Selector from "../../components/selector/selector";
import {
    isRequired,
    hasLength,
    validateType,
    maxLength,
} from "../../utils/validate";
import { normalizeString } from "../../utils/normalize";
import { SERVER_URI } from "../../utils/constants";
import TextArea from "../../components/textarea/textarea";
import Loader
    from "../../components/loader/loader.component";

const handleValidate = ({
                            title,
                            city,
                            type,
                            shortDescription = "",
                            description = "",
                        }) => {
    const errors = {};
    const requiredLength = hasLength(3, 15);
    const lengthShortDescription = maxLength(200);
    const lengthDescription = maxLength(1000);

    errors.title = isRequired(title) || requiredLength(title);
    errors.city = isRequired(city) || requiredLength(city);
    errors.type = validateType(type);
    errors.shortDescription = lengthShortDescription(shortDescription);
    errors.description = lengthDescription(description);

    return errors;
};

function Add() {
    const [ notification, setNotification ] = useState({
        isLoad: false,
        message: "",
    });

    const handleSubmit = (data) => {
        console.log(data);
        const uri = `${SERVER_URI}/add`;
        const normalizedData = {
            title: normalizeString(data.title),
            city: normalizeString(data.city),
            type: data.type,
            shortDescription: data.shortDescription || "",
            description: data.description || "",
            img: data.img || "http://consaltliga.com.ua/wp-content/themes/consultix/images/no-image-found-360x250.png",
        };

        setNotification({
            isLoad: true,
            message: "",
        })

        fetch(uri, {
            method: "POST",
            body: JSON.stringify(normalizedData),
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((data) => data.json())
            .then((body) => {
                setTimeout(() => {
                    setNotification({
                        isLoad: false,
                        message: body.message,
                    })
                }, 2000);
            });
    };

    return (
        <div className="text-center">
            <h2>???????????? ?????????? ????????????</h2>
            <p className="text-green-600 font-bold">{notification.message}</p>
            <Form onSubmit={handleSubmit}
                  validate={handleValidate}
                  render={({ handleSubmit }) => (
                      <form action="" method="POST"
                            onSubmit={handleSubmit}
                            className="my-6 text-left">
                          <Field component={Label}
                                 title="?????????????? ?????????? ??????????????"
                                 placeholder="?????????? ???????????? ??????????????"
                                 name="title"
                                 required/>
                          <Field component={Label}
                                 className="mt-3"
                                 title="?????????????? ?????????? ??????????, ???? ?????????????????????? ?????? ????????????"
                                 placeholder="?????????? ??????????"
                                 name="city"
                                 required/>
                          <Field component={Label}
                                 className="mt-3"
                                 title="?????????????? URL ???????????????? ???????????? ??????????????"
                                 placeholder="URL ????????????????"
                                 name="img"/>
                          <Field component={Selector}
                                 className="mt-3"
                                 title="???????????????? ?????? ???????????? ??????????????"
                                 name="type"
                                 defaultValue="none"
                                 required/>
                          <Field component={TextArea}
                                 name="shortDescription"
                                 placeholder="?????????????? ???????????????? ????????(???? 200 ????????????????)"/>
                          <Field component={TextArea}
                                 name="description"
                                 placeholder="?????????????? ???????????? ????????(???? 1000 ????????????????)"/>
                          <div className="mt-6 text-right">
                              <button type="submit"
                                      className="btn">
                                  ????????????
                              </button>
                          </div>
                      </form>
                  )}/>
            {
                notification.isLoad ? <Loader/> : null
            }
        </div>
    );
}

export default Add;
