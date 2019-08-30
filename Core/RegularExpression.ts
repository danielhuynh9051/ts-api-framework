export const checkRoutePath = /^((\/[a-zA-Z0-9-]+)|(\/{[a-zA-Z_]+}))+$/;
export const checkModuleName = /^[a-z]+$/;
export const getParamsInRoutePath = /{([a-zA-Z_]+)}/g;
export const checkMongoId = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
export const checkMongoIds = /^[0-9a-fA-F]{24}$|^([0-9a-fA-F]{24},)*([0-9a-fA-F]{24})$/i;
export const checkMongoIdAllowEmpty = /^$|^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
export const checkSortArrayString = /^([a-zA-Z0-9-_.]+\|(asc|desc),)*([a-zA-Z0-9-_.]+\|(asc|desc))$/i;
export const checkValueArrayString = /^([a-zA-Z0-9-_.]+\|[^{};$,]+,)*([a-zA-Z0-9-_.]+\|[^{};$,]+)$/i;
export const checkString = /^[^{};$]+$/i;
export const checkFields = /^([a-zA-Z0-9-_.]+,)*([a-zA-Z0-9-_.]+)$/i;
export const checkMethod = /^(get|post|put|delete)$/i;
export const checkNumberString = /^[0-9]+$/;
export const checkVietnamPhoneNumberString = /^\+{0,1}[0-9]{8,14}$/;
export const checkPassword = /^(?=.*[A-Z !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/i;
export const checkRangeSource = /^([.0-9]*)_([.0-9]*)$/i;
export const roleCode = /^[A-Z]+[A-Z0-9_]$/g;