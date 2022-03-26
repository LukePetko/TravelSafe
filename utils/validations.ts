import { RegisterState } from "../screens/auth/Register";
import { NewHolidayState } from "../screens/trip/NewHolidayScreen";
import { NewTripState } from "../screens/trip/NewTripScreen";

export type RegisterErrors = {
    fields: {
        username: string;
        email: string;
        confirmEmail: string;
        password: string;
        confirmPassword: string;
        birthDate: string;
    };
    isValid: boolean;
};

export type NewTripErrors = {
    fields: {
        name: string;
    };
    isValid: boolean;
};

export type NewHolidayErrors = {
    fields: {
        name: string;
    };
    isValid: boolean;
};

const checkLength = (
    value: string,
    min: number,
    max: number,
    fieldName: string,
): string => {
    if (value.length < min) {
        return `${fieldName} must be at least ${min} characters`;
    } else if (value.length > max) {
        return `${fieldName} must be less than ${max} characters`;
    } else {
        return "";
    }
};

const checkMatch = (
    value: string,
    value2: string,
    fieldName: string,
): string => {
    if (value !== value2) {
        return `${fieldName} must match`;
    } else {
        return "";
    }
};

const checkEmail = (value: string): string => {
    const emailRegex = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    if (!emailRegex.test(value)) {
        return "Invalid email";
    }
    return "";
};

export const registerValidation = (state: RegisterState): RegisterErrors => {
    const errors: RegisterErrors = {
        fields: {
            username: "",
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
            birthDate: "",
        },
        isValid: true,
    };

    errors.fields.username = checkLength(state.username, 3, 20, "Username");

    errors.fields.email = checkLength(state.email, 3, 50, "Email");

    if (errors.fields.email === "") {
        errors.fields.email = checkEmail(state.email);
    }

    if (errors.fields.email === "") {
        errors.fields.confirmEmail = checkMatch(
            state.email,
            state.confirmEmail,
            "Email",
        );
    }

    errors.fields.password = checkLength(state.password, 8, 20, "Password");

    if (errors.fields.password === "") {
        errors.fields.confirmPassword = checkMatch(
            state.password,
            state.confirmPassword,
            "Password",
        );
    }

    if (
        Object.values(errors.fields).filter((field) => field !== "").length ===
        0
    ) {
        errors.isValid = true;
    } else {
        errors.isValid = false;
    }

    return errors;
};

export const newTripValidation = (state: NewTripState): NewTripErrors => {
    const errors: NewTripErrors = {
        fields: {
            name: "",
        },
        isValid: true,
    };

    if (state.name === "") {
        errors.fields.name = "Name is required";
        errors.isValid = false;
    }
    return errors;
};

export const newHolidayValidation = (
    state: NewHolidayState,
): NewHolidayErrors => {
    const errors: NewHolidayErrors = {
        fields: {
            name: "",
        },
        isValid: true,
    };

    if (state.name === "") {
        errors.fields.name = "Name is required";
        errors.isValid = false;
    }
    return errors;
};
