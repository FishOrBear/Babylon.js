import {
    DiagramEngine,
    DiagramModel,
    DiagramWidget,
    LinkModel
} from "storm-react-diagrams";

import * as React from "react";
import { GlobalState } from './globalState';

import { GenericNodeFactory } from './components/diagram/generic/genericNodeFactory';
import { GenericNodeModel } from './components/diagram/generic/genericNodeModel';
import { NodeMaterialBlock } from 'babylonjs/Materials/Node/nodeMaterialBlock';
import { NodeMaterialConnectionPoint } from 'babylonjs/Materials/Node/nodeMaterialBlockConnectionPoint';
import { NodeListComponent } from './components/nodeList/nodeListComponent';
import { PropertyTabComponent } from './components/propertyTab/propertyTabComponent';
import { Portal } from './portal';
import { TextureNodeFactory } from './components/diagram/texture/textureNodeFactory';
import { DefaultNodeModel } from './components/diagram/defaultNodeModel';
import { TextureNodeModel } from './components/diagram/texture/textureNodeModel';
import { DefaultPortModel } from './components/diagram/port/defaultPortModel';
import { InputNodeFactory } from './components/diagram/input/inputNodeFactory';
import { InputNodeModel } from './components/diagram/input/inputNodeModel';
import { TextureBlock } from 'babylonjs/Materials/Node/Blocks/Dual/textureBlock';
import { LogComponent, LogEntry } from './components/log/logComponent';
import { LightBlock } from 'babylonjs/Materials/Node/Blocks/Dual/lightBlock';
import { LightNodeModel } from './components/diagram/light/lightNodeModel';
import { LightNodeFactory } from './components/diagram/light/lightNodeFactory';
import { DataStorage } from './dataStorage';
import { NodeMaterialBlockConnectionPointTypes } from 'babylonjs/Materials/Node/nodeMaterialBlockConnectionPointTypes';
import { InputBlock } from 'babylonjs/Materials/Node/Blocks/Input/inputBlock';
import { Nullable } from 'babylonjs/types';
import { MessageDialogComponent } from './sharedComponents/messageDialog';
import { BlockTools } from './blockTools';
import { AdvancedLinkFactory } from './components/diagram/link/advancedLinkFactory';
import { RemapNodeFactory } from './components/diagram/remap/remapNodeFactory';
import { RemapNodeModel } from './components/diagram/remap/remapNodeModel';
import { RemapBlock } from 'babylonjs/Materials/Node/Blocks/remapBlock';
import { GraphHelper } from './graphHelper';
import { PreviewManager } from './components/preview/previewManager';
import { INodeLocationInfo } from './nodeLocationInfo';
import { PreviewMeshControlComponent } from './components/preview/previewMeshControlComponent';

require("storm-react-diagrams/dist/style.min.css");
require("./main.scss");
require("./components/diagram/diagram.scss");

interface IGraphEditorProps {
    globalState: GlobalState;
}

export class NodeCreationOptions {
    nodeMaterialBlock: NodeMaterialBlock;
    type?: string;
    connection?: NodeMaterialConnectionPoint;
}

export class GraphEditor extends React.Component<IGraphEditorProps> {
    private readonly NodeWidth = 100;
    private _engine: DiagramEngine;
    private _model: DiagramModel;

    private _startX: number;
    private _moveInProgress: boolean;

    private _leftWidth = DataStorage.ReadNumber("LeftWidth", 200);
    private _rightWidth = DataStorage.ReadNumber("RightWidth", 300);

    private _nodes = new Array<DefaultNodeModel>();
    private _blocks = new Array<NodeMaterialBlock>();

    private _previewManager: PreviewManager;

    /** @hidden */
    public _toAdd: LinkModel[] | null = [];

    /**
     * Creates a node and recursivly creates its parent nodes from it's input
     * @param nodeMaterialBlock 
     */
    public createNodeFromObject(options: NodeCreationOptions) {
        if (this._blocks.indexOf(options.nodeMaterialBlock) !== -1) {        
            return this._nodes.filter(n => n.block === options.nodeMaterialBlock)[0];
        }

        this._blocks.push(options.nodeMaterialBlock);

        if (this.props.globalState.nodeMaterial!.attachedBlocks.indexOf(options.nodeMaterialBlock) === -1) {
            this.props.globalState.nodeMaterial!.attachedBlocks.push(options.nodeMaterialBlock);
        }

        // Create new node in the graph
        var newNode: DefaultNodeModel;
       
        if (options.nodeMaterialBlock instanceof TextureBlock) {
            newNode = new TextureNodeModel();
        } else if (options.nodeMaterialBlock instanceof LightBlock) {
            newNode = new LightNodeModel();
        } else if (options.nodeMaterialBlock instanceof InputBlock) {
            newNode = new InputNodeModel();        
        } else if (options.nodeMaterialBlock instanceof RemapBlock) {
            newNode = new RemapNodeModel();
        } else {
            newNode = new GenericNodeModel();
        }

        if (options.nodeMaterialBlock.isFinalMerger) {
            this.props.globalState.nodeMaterial!.addOutputNode(options.nodeMaterialBlock);
        }

        this._nodes.push(newNode)
        this._model.addAll(newNode);

        if (options.nodeMaterialBlock) {
            newNode.prepare(options, this._nodes, this._model, this);
        }

        return newNode;
    }
    
    addValueNode(type: string) {
        let nodeType: NodeMaterialBlockConnectionPointTypes = BlockTools.GetConnectionNodeTypeFromString(type);

        let newInputBlock = new InputBlock(type, undefined, nodeType);
        var localNode = this.createNodeFromObject({ type: type, nodeMaterialBlock: newInputBlock })

        return localNode;
    }

    componentDidMount() {
        if (this.props.globalState.hostDocument) {
            var widget = (this.refs["test"] as DiagramWidget);
            widget.setState({ document: this.props.globalState.hostDocument })
            this.props.globalState.hostDocument!.addEventListener("keyup", widget.onKeyUpPointer as any, false);

            this._previewManager = new PreviewManager(this.props.globalState.hostDocument.getElementById("preview-canvas") as HTMLCanvasElement, this.props.globalState);
        }
    }

    componentWillUnmount() {
        if (this.props.globalState.hostDocument) {
            var widget = (this.refs["test"] as DiagramWidget);
            this.props.globalState.hostDocument!.removeEventListener("keyup", widget.onKeyUpPointer as any, false);
        }

        this._previewManager.dispose();
    }

    constructor(props: IGraphEditorProps) {
        super(props);

        // setup the diagram engine
        this._engine = new DiagramEngine();
        this._engine.installDefaultFactories()
        this._engine.registerNodeFactory(new GenericNodeFactory(this.props.globalState));
        this._engine.registerNodeFactory(new TextureNodeFactory(this.props.globalState));
        this._engine.registerNodeFactory(new LightNodeFactory(this.props.globalState));
        this._engine.registerNodeFactory(new InputNodeFactory(this.props.globalState));
        this._engine.registerNodeFactory(new RemapNodeFactory(this.props.globalState));
        this._engine.registerLinkFactory(new AdvancedLinkFactory());

        this.props.globalState.onRebuildRequiredObservable.add(() => {
            if (this.props.globalState.nodeMaterial) {
                this.buildMaterial();
            }
            this.forceUpdate();
        });

        this.props.globalState.onResetRequiredObservable.add((locations) => {
            this.build(false, locations);
            if (this.props.globalState.nodeMaterial) {
                this.buildMaterial();
            }
        });

        this.props.globalState.onUpdateRequiredObservable.add(() => {
            this.forceUpdate();
        });

        this.props.globalState.onZoomToFitRequiredObservable.add(() => {
            this.zoomToFit();
        });

        this.props.globalState.onReOrganizedRequiredObservable.add(() => {
            this.reOrganize();
        });

        this.props.globalState.onGetNodeFromBlock = (block) => {
            return this._nodes.filter(n => n.block === block)[0];
        }

        this.build(true);
    }

    zoomToFit(retry = 0) {
        const xFactor = this._engine.canvas.clientWidth / this._engine.canvas.scrollWidth;
        const yFactor = this._engine.canvas.clientHeight / this._engine.canvas.scrollHeight;
        const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

        if (zoomFactor === 1) {
            return;
        }

        this._engine.diagramModel.setZoomLevel(this._engine.diagramModel.getZoomLevel() * zoomFactor);
        this._engine.diagramModel.setOffset(0, 0);
        this._engine.repaintCanvas();
        retry++;
        if (retry < 4) {
            setTimeout(() => this.zoomToFit(retry), 1);
        }
    }

 

    buildMaterial() {
        if (!this.props.globalState.nodeMaterial) {
            return;
        }

        try {
            this.props.globalState.nodeMaterial.build();
            this.props.globalState.onLogRequiredObservable.notifyObservers(new LogEntry("Node material build successful", false));
        }
        catch (err) {
            this.props.globalState.onLogRequiredObservable.notifyObservers(new LogEntry(err, true));
        }
    }

    build(needToWait = false, locations: Nullable<INodeLocationInfo[]> = null) {
        // setup the diagram model
        this._model = new DiagramModel();
        this._nodes = [];
        this._blocks = [];

        // Listen to events
        this._model.addListener({
            nodesUpdated: (e) => {                
                if (!e.isCreated) {
                    // Block is deleted
                    let targetBlock = (e.node as GenericNodeModel).block;

                    if (targetBlock) {
                        let attachedBlockIndex = this.props.globalState.nodeMaterial!.attachedBlocks.indexOf(targetBlock);
                        if (attachedBlockIndex > -1) {
                            this.props.globalState.nodeMaterial!.attachedBlocks.splice(attachedBlockIndex, 1);
                        }

                        if (targetBlock.isFinalMerger) {
                            this.props.globalState.nodeMaterial!.removeOutputNode(targetBlock);
                        }
                        let blockIndex = this._blocks.indexOf(targetBlock);

                        if (blockIndex > -1) {
                            this._blocks.splice(blockIndex, 1);
                        }
                    }                  

                    this.props.globalState.onSelectionChangedObservable.notifyObservers(null);
                }
            },
            linksUpdated: (e) => {
                if (!e.isCreated) {
                    // Link is deleted
                    this.props.globalState.onSelectionChangedObservable.notifyObservers(null);
                    let sourcePort = e.link.sourcePort as DefaultPortModel;

                    var link = DefaultPortModel.SortInputOutput(sourcePort, e.link.targetPort as DefaultPortModel);
                    if (link) {
                        if (link.input.connection && link.output.connection) {
                            if (link.input.connection.connectedPoint) {
                                // Disconnect standard nodes
                                link.output.connection.disconnectFrom(link.input.connection);
                                link.input.syncWithNodeMaterialConnectionPoint(link.input.connection);
                                link.output.syncWithNodeMaterialConnectionPoint(link.output.connection);
                            }
                        }
                    } else {
                        if (!e.link.targetPort && e.link.sourcePort && (e.link.sourcePort as DefaultPortModel).position === "input") {
                            // Drag from input port, we are going to build an input for it                            
                            let input = e.link.sourcePort as DefaultPortModel;
                            let nodeModel = this.addValueNode(BlockTools.GetStringFromConnectionNodeType(input.connection!.type));
                            let link = nodeModel.ports.output.link(input);

                            nodeModel.x = e.link.points[1].x - this.NodeWidth;
                            nodeModel.y = e.link.points[1].y;

                            setTimeout(() => {
                                this._model.addLink(link);
                                input.syncWithNodeMaterialConnectionPoint(input.connection!);
                                nodeModel.ports.output.syncWithNodeMaterialConnectionPoint(nodeModel.ports.output.connection!);                                 

                                this.forceUpdate();
                            }, 1);
                           
                            nodeModel.ports.output.connection!.connectTo(input.connection!);
                            this.props.globalState.onRebuildRequiredObservable.notifyObservers();
                        }
                    }
                    this.forceUpdate();
                    return;
                }

                e.link.addListener({
                    sourcePortChanged: () => {
                    },
                    targetPortChanged: () => {
                        // Link is created with a target port
                        var link = DefaultPortModel.SortInputOutput(e.link.sourcePort as DefaultPortModel, e.link.targetPort as DefaultPortModel);

                        if (link) {
                            if (link.output.connection && link.input.connection) {
                                // Disconnect previous connection
                                for (var key in link.input.links) {
                                    let other = link.input.links[key];

                                    if ((other.getSourcePort() as DefaultPortModel).connection  !== (link.output as DefaultPortModel).connection && 
                                        (other.getTargetPort() as DefaultPortModel).connection  !== (link.output as DefaultPortModel).connection
                                    ) {
                                        other.remove();
                                    }
                                }

                                try {
                                    link.output.connection.connectTo(link.input.connection);
                                }        
                                catch (err) {
                                    link.output.remove();
                                    this.props.globalState.onLogRequiredObservable.notifyObservers(new LogEntry(err, true));
                                    this.props.globalState.onErrorMessageDialogRequiredObservable.notifyObservers(err);
                                }

                                this.forceUpdate();
                            }
                            if (this.props.globalState.nodeMaterial) {
                                this.buildMaterial();
                            }
                        }
                    }
                })
            }
        });

        // Load graph of nodes from the material
        if (this.props.globalState.nodeMaterial) {
            var material = this.props.globalState.nodeMaterial;
            material._vertexOutputNodes.forEach((n: any) => {
                this.createNodeFromObject({ nodeMaterialBlock: n });
            });
            material._fragmentOutputNodes.forEach((n: any) => {
                this.createNodeFromObject({ nodeMaterialBlock: n });
            });

            material.attachedBlocks.forEach((n: any) => {
                this.createNodeFromObject({ nodeMaterialBlock: n });
            });
        }

        // load model into engine
        setTimeout(() => {
            if (this._toAdd) {
                this._model.addAll(...this._toAdd);
            }
            this._toAdd = null;
            this._engine.setDiagramModel(this._model);

            this.forceUpdate();

            this.reOrganize(locations);
        }, needToWait ? 500 : 1);
    }

    reOrganize(locations: Nullable<INodeLocationInfo[]> = null) {
        if (!locations) {
            let nodes = GraphHelper.DistributeGraph(this._model);
            nodes.forEach(node => {
                for (var nodeName in this._model.nodes) {
                    let modelNode = this._model.nodes[nodeName];

                    if (modelNode.id === node.id) {
                        modelNode.setPosition(node.x - node.width / 2, node.y - node.height / 2);
                        return;
                    }
                }
            });
        } else {
            for (var location of locations) {
                for (var node of this._nodes) {
                    if (node.block && node.block.uniqueId === location.blockId) {
                        node.setPosition(location.x, location.y);
                        break;
                    }
                }
            }
        }

        this._engine.repaintCanvas();
    }

    onPointerDown(evt: React.PointerEvent<HTMLDivElement>) {
        this._startX = evt.clientX;
        this._moveInProgress = true;
        evt.currentTarget.setPointerCapture(evt.pointerId);
    }

    onPointerUp(evt: React.PointerEvent<HTMLDivElement>) {
        this._moveInProgress = false;
        evt.currentTarget.releasePointerCapture(evt.pointerId);
    }

    resizeColumns(evt: React.PointerEvent<HTMLDivElement>, forLeft = true) {
        if (!this._moveInProgress) {
            return;
        }

        const deltaX = evt.clientX - this._startX;
        const rootElement = evt.currentTarget.ownerDocument!.getElementById("node-editor-graph-root") as HTMLDivElement;

        if (forLeft) {
            this._leftWidth += deltaX;
            this._leftWidth = Math.max(150, Math.min(400, this._leftWidth));
            DataStorage.StoreNumber("LeftWidth", this._leftWidth);
        } else {
            this._rightWidth -= deltaX;
            this._rightWidth = Math.max(250, Math.min(500, this._rightWidth));
            DataStorage.StoreNumber("RightWidth", this._rightWidth);
            rootElement.ownerDocument!.getElementById("preview")!.style.height = this._rightWidth + "px";
        }

        rootElement.style.gridTemplateColumns = this.buildColumnLayout();

        this._startX = evt.clientX;
    }

    buildColumnLayout() {
        return `${this._leftWidth}px 4px calc(100% - ${this._leftWidth + 8 + this._rightWidth}px) 4px ${this._rightWidth}px`;
    }

    emitNewBlock(event: React.DragEvent<HTMLDivElement>) {
        var data = event.dataTransfer.getData("babylonjs-material-node") as string;
        let nodeModel: Nullable<DefaultNodeModel> = null;

        if (data.indexOf("Block") === -1) {
            nodeModel = this.addValueNode(data);
        } else {
            let block = BlockTools.GetBlockFromString(data);          

            if (block) {
                nodeModel = this.createNodeFromObject({ nodeMaterialBlock: block });
            }
        };

        if (nodeModel) {
            const zoomLevel = this._engine.diagramModel.getZoomLevel() / 100.0;

            let x = (event.clientX - event.currentTarget.offsetLeft - this._engine.diagramModel.getOffsetX() - this.NodeWidth) / zoomLevel;
            let y = (event.clientY - event.currentTarget.offsetTop - this._engine.diagramModel.getOffsetY() - 20) / zoomLevel;
            nodeModel.setPosition(x, y);
        }

        this.forceUpdate();
    }

    render() {
        return (
            <Portal globalState={this.props.globalState}>
                <div id="node-editor-graph-root" style={
                    {
                        gridTemplateColumns: this.buildColumnLayout()
                    }
                }>
                    {/* Node creation menu */}
                    <NodeListComponent globalState={this.props.globalState} />

                    <div id="leftGrab"
                        onPointerDown={evt => this.onPointerDown(evt)}
                        onPointerUp={evt => this.onPointerUp(evt)}
                        onPointerMove={evt => this.resizeColumns(evt)}
                    ></div>

                    {/* The node graph diagram */}
                    <div className="diagram-container"
                        onDrop={event => {
                            this.emitNewBlock(event);
                        }}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                    >
                        <DiagramWidget className="diagram" deleteKeys={[46]} ref={"test"} 
                        allowLooseLinks={false}
                        inverseZoom={true} 
                        diagramEngine={this._engine} 
                        maxNumberPointsPerLink={0} />
                    </div>

                    <div id="rightGrab"
                        onPointerDown={evt => this.onPointerDown(evt)}
                        onPointerUp={evt => this.onPointerUp(evt)}
                        onPointerMove={evt => this.resizeColumns(evt, false)}
                    ></div>

                    {/* Property tab */}
                    <div className="right-panel">
                        <PropertyTabComponent globalState={this.props.globalState} />
                        <PreviewMeshControlComponent globalState={this.props.globalState} />
                        <div id="preview" style={{height: this._rightWidth + "px"}}>
                            <canvas id="preview-canvas"/>
                        </div>
                    </div>

                    <LogComponent globalState={this.props.globalState} />
                </div>                
                <MessageDialogComponent globalState={this.props.globalState} />
            </Portal>
        );

    }
}