import camelcase from "lodash/camelcase"

export const mapToCamelCase = (object: any) => {
    const returnObject: any = {}

    for(const index in object) {
        returnObject[camelcase(index)] = object[index]
    }

    return returnObject
}