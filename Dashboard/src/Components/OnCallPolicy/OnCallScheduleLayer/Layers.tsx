import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import OnCallDutyPolicyScheduleLayer from 'Model/Models/OnCallDutyPolicyScheduleLayer';
import Layer from './Layer';
import Button from 'CommonUI/src/Components/Button/Button';
import IconProp from 'Common/Types/Icon/IconProp';
import BadDataException from 'Common/Types/Exception/BadDataException';
import ModelAPI, { ListResult } from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import API from 'CommonUI/src/Utils/API/API';
import ObjectID from 'Common/Types/ObjectID';
import RestrictionTimes from 'Common/Types/OnCallDutyPolicy/RestrictionTimes';
import Rotation from 'Common/Types/OnCallDutyPolicy/Rotation';
import OneUptimeDate from 'Common/Types/Date';
import ComponentLoader from 'CommonUI/src/Components/ComponentLoader/ComponentLoader';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import ConfirmModal from 'CommonUI/src/Components/Modal/ConfirmModal';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import { JSONArray, JSONObject } from 'Common/Types/JSON';

export interface ComponentProps {
    onCallDutyPolicyScheduleId: ObjectID;
    projectId: ObjectID;
}

const Layers: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [layers, setLayers] = React.useState<
        Array<OnCallDutyPolicyScheduleLayer>
    >([]);

    const [isAddbuttonLoading, setIsAddButtonLoading] =
        React.useState<boolean>(false);

    const [error, setError] = React.useState<string>('');

    const [isDeletetingLayerId, setIsDeletingLayerId] = React.useState<
        Array<ObjectID>
    >([]);

    const [showCannotDeleteOnlyLayerError, setShowCannotDeleteOnlyLayerError] =
        React.useState<boolean>(false);

    useEffect(() => {
        //fetch layers.
        fetchLayers().catch((err: Error) => {
            setError(err.message);
        });
    }, []);

    const addLayer: Function = async () => {
        setIsAddButtonLoading(true);

        try {
            const onCallPolicyScheduleLayer: OnCallDutyPolicyScheduleLayer =
                new OnCallDutyPolicyScheduleLayer();
            onCallPolicyScheduleLayer.onCallDutyPolicyScheduleId =
                props.onCallDutyPolicyScheduleId;
            onCallPolicyScheduleLayer.projectId = props.projectId;

            // count the layers and generate a unique name for this layer.
            const newLayerName: string = `Layer ${layers.length + 1}`;
            onCallPolicyScheduleLayer.name = newLayerName;

            // count the description and generate a unique description for this layer.
            const newLayerDescription: string = `Layer ${
                layers.length + 1
            } description.`;
            onCallPolicyScheduleLayer.description = newLayerDescription;
            onCallPolicyScheduleLayer.order = layers.length + 1;
            onCallPolicyScheduleLayer.restrictionTimes =
                RestrictionTimes.getDefault();
            onCallPolicyScheduleLayer.rotation = Rotation.getDefault();
            onCallPolicyScheduleLayer.startsAt = OneUptimeDate.getCurrentDate();

            const newLayer: HTTPResponse<
                | OnCallDutyPolicyScheduleLayer
                | OnCallDutyPolicyScheduleLayer[]
                | JSONObject
                | JSONArray
            > = await ModelAPI.create<OnCallDutyPolicyScheduleLayer>(
                onCallPolicyScheduleLayer,
                OnCallDutyPolicyScheduleLayer,
                {}
            );

            // add this layer to layers array and set it.
            setLayers([
                ...layers,
                newLayer.data as OnCallDutyPolicyScheduleLayer,
            ]);
        } catch (err) {
            setError(API.getFriendlyMessage(err));
        }

        setIsAddButtonLoading(false);
    };

    const deleteLayer: Function = async (
        item: OnCallDutyPolicyScheduleLayer
    ) => {
        if (!item.id) {
            throw new BadDataException('item.id cannot be null');
        }

        if (layers.length === 1) {
            setShowCannotDeleteOnlyLayerError(true);
            return;
        }

        // push this layer id to isDeletetingLayerId array.
        setIsDeletingLayerId([...isDeletetingLayerId, item.id]);

        try {
            await ModelAPI.deleteItem<OnCallDutyPolicyScheduleLayer>(
                OnCallDutyPolicyScheduleLayer,
                item.id,
                {}
            );

            // remove this layer from layers array and set it.

            const newLayers: Array<OnCallDutyPolicyScheduleLayer> =
                layers.filter((layer: OnCallDutyPolicyScheduleLayer) => {
                    return layer.id?.toString() !== item.id?.toString();
                });

            setLayers(newLayers);
        } catch (err) {
            setError(API.getFriendlyMessage(err));
        }

        // remove this layer id from isDeletetingLayerId array.
        setIsDeletingLayerId(
            isDeletetingLayerId.filter((id: ObjectID) => {
                return id?.toString() !== item.id?.toString();
            })
        );
    };

    const fetchLayers: Function = async () => {
        setIsLoading(true);

        try {
            const layers: ListResult<OnCallDutyPolicyScheduleLayer> =
                await ModelAPI.getList<OnCallDutyPolicyScheduleLayer>(
                    OnCallDutyPolicyScheduleLayer,
                    {
                        onCallDutyPolicyScheduleId:
                            props.onCallDutyPolicyScheduleId,
                        projectId: props.projectId,
                    },
                    LIMIT_PER_PROJECT,
                    0,
                    {
                        order: true,
                        name: true,
                        description: true,
                        startsAt: true,
                        restrictionTimes: true,
                        rotation: true,
                        onCallDutyPolicyScheduleId: true,
                        projectId: true,
                    },
                    {
                        order: SortOrder.Ascending,
                    }
                );

            setLayers(layers.data);
        } catch (err) {
            setError(API.getFriendlyMessage(err));
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return <ComponentLoader />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div>
            <div>
                {layers.map(
                    (layer: OnCallDutyPolicyScheduleLayer, i: number) => {
                        return (
                            <Layer
                                key={i}
                                isDeleteButtonLoading={Boolean(
                                    isDeletetingLayerId.find((id: ObjectID) => {
                                        return (
                                            id.toString() ===
                                            layer.id?.toString()
                                        );
                                    })
                                )}
                                layer={layer}
                                onDeleteLayer={() => {
                                    deleteLayer(layer);
                                }}
                                onLayerChange={(
                                    layer: OnCallDutyPolicyScheduleLayer
                                ) => {
                                    // update this layer in layers array and set it.
                                    const newLayers: Array<OnCallDutyPolicyScheduleLayer> =
                                        layers.map(
                                            (
                                                item: OnCallDutyPolicyScheduleLayer
                                            ) => {
                                                if (item.id === layer.id) {
                                                    return layer;
                                                }
                                                return item;
                                            }
                                        );

                                    setLayers(newLayers);
                                }}
                            />
                        );
                    }
                )}
            </div>

            {layers.length === 0 && (
                <ErrorMessage error="No layers in this schedule. Please add a layer." />
            )}

            <div>
                <Button
                    title="Add New Layer"
                    isLoading={isAddbuttonLoading}
                    onClick={() => {
                        addLayer();
                    }}
                    icon={IconProp.Add}
                />
            </div>

            {showCannotDeleteOnlyLayerError ? (
                <ConfirmModal
                    title={`Cannot delete layer`}
                    description={
                        <div>Schedule must have at least one layer.</div>
                    }
                    isLoading={false}
                    submitButtonText={'Close'}
                    onSubmit={() => {
                        return setShowCannotDeleteOnlyLayerError(false);
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    );
};

export default Layers;
