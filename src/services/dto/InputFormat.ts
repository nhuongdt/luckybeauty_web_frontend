export interface InputNumber {
    textMask: string;
    numberFormat: string;
}
export interface InputPropNumber {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
