import React, { useState } from 'react';

const TreeNode = ({ node, onCheckboxChange }: any) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event: any) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        onCheckboxChange(node.name, checked);
    };

    return (
        <li>
            <label>
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                {node.displayName}
            </label>
            {node.children && node.children.length > 0 && (
                <ul>
                    {node.children.map((childNode: any) => (
                        <TreeNode
                            key={childNode.name}
                            node={childNode}
                            onCheckboxChange={onCheckboxChange}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const Treeview = ({ data }: any) => {
    const [checkedNodes, setCheckedNodes] = useState<string[]>([]);

    const handleCheckboxChange = (nodeName: any, isChecked: any) => {
        if (isChecked) {
            setCheckedNodes([...checkedNodes, nodeName]);
        } else {
            setCheckedNodes(checkedNodes.filter((node) => node !== nodeName));
        }
    };

    return (
        <ul>
            {data.map((node: any) => (
                <TreeNode key={node.name} node={node} onCheckboxChange={handleCheckboxChange} />
            ))}
        </ul>
    );
};
export default Treeview;
