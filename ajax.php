<?php
require_once 'conexion.php';

$function = isset($_POST['function']) ? $_POST['function'] : null;
$local = $_POST['local'];
$cantidad = isset($_POST['cantidad']) ? intval($_POST['cantidad']) : null;
$desde = isset($_POST['desde']) ? date("Y-m-d", strtotime(str_replace('/', '-', $_POST['desde']))) : null;
$hasta = isset($_POST['hasta']) ? date("Y-m-d", strtotime(str_replace('/', '-', $_POST['hasta']))) : null;

switch ($function) {
    case 'ReporteVedendores':
        $sql = "SELECT 
        p.`nombre_completo`,
        SUM(v.`total_venta`) AS total 
        FROM
            `fac_venta` v
        INNER JOIN `app_usuario` u ON u.`id_usuario` = v.`usuario_crea`
        INNER JOIN `app_persona` p ON p.`id_persona` = u.`id_persona`
        WHERE v.id_local = :loc
        AND CAST(v.`fecha_crea` AS DATE) BETWEEN :des 
            AND :has 
        GROUP BY v.`usuario_crea`
        LIMIT 20";
        $statement = Conexion::conectar()->prepare($sql);
        $statement->bindParam(':loc', $local, PDO::PARAM_INT);
        $statement->bindParam(':des', $desde, PDO::PARAM_STR);
        $statement->bindParam(':has', $hasta, PDO::PARAM_STR);
        $statement->execute();
        $res = $statement->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($res);
        break;
    case 'reporteStock0':
        $sql = "SELECT 
            * 
        FROM
            fac_local_producto flp 
            INNER JOIN fac_catalogo fc 
            ON fc.id_catalogo = flp.`id_catalogo` 
        WHERE id_local = :loc 
            AND flp.`stock_actual` = 0
            LIMIT :can";
        $statement = Conexion::conectar()->prepare($sql);
        $statement->bindParam(':loc', $local, PDO::PARAM_INT);
        $statement->bindParam(':can', $cantidad, PDO::PARAM_INT);
        $statement->execute();
        $res = $statement->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($res);    
        break;
        
        case 'reporteStock6':
            $sql = "SELECT 
                * 
            FROM
                fac_local_producto flp 
                INNER JOIN fac_catalogo fc 
                ON fc.id_catalogo = flp.`id_catalogo` 
            WHERE id_local = :loc 
            AND flp.`stock_actual` > 0 AND flp.`stock_actual` <=4 
                LIMIT :can";
            $statement = Conexion::conectar()->prepare($sql);
            $statement->bindParam(':loc', $local, PDO::PARAM_INT);
            $statement->bindParam(':can', $cantidad, PDO::PARAM_INT);
            $statement->execute();
            $res = $statement->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($res);    
            break;

        // REPORTE DE PRODUCTOS DE VENTAS
        
        case 'reporteVendidos':
            $sql = "SELECT 
                    c.codigo_interno codigo, 
                    c.catalogo catalogo, 
                    m.marca marca, 
                    ct.categoria categoria,
                    p.razon_social proveedor,
                    c.ubicacion ubicacion,
                    c.nxcaja nx_caja,
                    lp.stock_actual stock,
                    lp.precio_publico p_pub,
                    lp.precio_ferreteria p_fer,
                    lp.precio_distribuidor p_dis,
                    lp.precio_compra_real p_com,
                    DATEDIFF(date(now()), date(cd.fecha_crea)) dias_pasados,
                    lp.activo estado 
                    FROM fac_compra co 
                    INNER JOIN fac_compra_detalle cd 
                    on co.id_compra = cd.id_compra 
                    RIGHT JOIN fac_proveedor p 
                    on co.id_proveedor = p.id_proveedor 
                    INNER JOIN fac_local_producto lp 
                    on cd.id_local_producto = lp.id_local_producto 
                    INNER JOIN fac_catalogo c 
                    on lp.id_catalogo = c.id_catalogo 
                    INNER JOIN fac_marca m 
                    on c.id_marca = m.id_marca 
                    INNER JOIN fac_categoria ct 
                    on c.id_categoria = ct.id_categoria WHERE lp.id_local = :loc LIMIT :can";

            $statement = Conexion::conectar()->prepare($sql);
            $statement->bindParam(':loc', $local, PDO::PARAM_INT);
            $statement->bindParam(':can', $cantidad, PDO::PARAM_INT);
            $statement->execute();
            $res = $statement->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($res);    
            break;

        // REPORTE DE UTILIDADES POR PRODUCTO
            
        case 'reporteUtilidades':
            $sql = "SELECT 
                    vd.fecha_crea fecha, 
                    c.catalogo catalogo,
                    m.marca marca, 
                    ct.categoria categoria,
                    lp.stock_actual stock,
                    vd.cantidad cantidad,
                    lp.precio_compra_real pc_unitario,
                    vd.precio_unitario pv_unitario,
                    vd.total total,
                    round(vd.cantidad * (vd.precio_unitario - lp.precio_compra_real), 2) utilidad
                    FROM fac_local_producto lp
                    INNER JOIN fac_catalogo c 
                    on lp.id_catalogo = c.id_catalogo 
                    INNER JOIN fac_marca m 
                    on c.id_marca = m.id_marca 
                    INNER JOIN fac_categoria ct 
                    on c.id_categoria = ct.id_categoria
                    INNER JOIN fac_venta_detalle vd
                    on vd.id_local_producto = lp.id_local_producto
                    WHERE lp.id_local = :loc 
                    ORDER BY vd.fecha_crea desc LIMIT :can";

            $statement = Conexion::conectar()->prepare($sql);
            $statement->bindParam(':loc', $local, PDO::PARAM_INT);
            $statement->bindParam(':can', $cantidad, PDO::PARAM_INT);
            $statement->execute();
            $res = $statement->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($res);    
            break;
    
    case 'RPU':
        $res = ['a'=>1, 'b'=>2, 'c'=>3, 'd'=>4];
        return json_encode($res);    
        break;
    

    default:
        $sql = "SELECT
        SUM(d.`cantidad`) ventas,
        c.`catalogo`
        FROM
        fac_venta v
        INNER JOIN `fac_venta_detalle` d ON d.`id_venta` = v.`id_venta`
        INNER JOIN `fac_local_producto` p ON d.`id_local_producto` = p.`id_local_producto`
        INNER JOIN fac_catalogo c ON c.`id_catalogo` = p.`id_catalogo`
        WHERE v.id_local = :loc
        AND CAST(v.fecha_crea AS DATE) BETWEEN :des
        AND :has
        GROUP BY c.`catalogo`
        ORDER BY ventas DESC
        LIMIT :can ";

        $statement = Conexion::conectar()->prepare($sql);
        $statement->bindParam(':loc', $local, PDO::PARAM_INT);
        $statement->bindParam(':des', $desde, PDO::PARAM_STR);
        $statement->bindParam(':has', $hasta, PDO::PARAM_STR);
        $statement->bindParam(':can', $cantidad, PDO::PARAM_INT);
        $statement->execute();
        $res = $statement->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($res);

        break;
    
}
